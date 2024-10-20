import {PrismaClient, Question, QuestionRegions, Region} from '@prisma/client';
import Memcached from "memcached";
import {calculateActiveDates} from "./regionService";

const prisma = new PrismaClient({log: ['query']});

const memcached = new Memcached(process.env.MEMCACHED_URL || 'localhost:11211');


export async function getCurrentQuestion(regionCode: string) {
    const region = await prisma.region.findUnique({
        where: {code: regionCode},
    });

    if (!region) {
        throw new Error(`Region with code ${regionCode} not found.`);
    }

    const questionRelation = await prisma.questionRegions.findFirstOrThrow({
        where: {
            regionId: region.id,
            activeTill: {gte: new Date()},
            activeFrom: {lte: new Date()},
        },
        orderBy: {activeTill: 'asc'},
        include: {question: true},
    });

    return questionRelation;
}

export function getCachedQuestion(
    regionCode: string,
): Promise<Question | null> {
    const cacheKey = `question:${regionCode}`;
    return new Promise((resolve, reject) => {
        memcached.get(cacheKey, (err, data) => {
            if (err) return reject(err);
            if (data) {
                resolve(JSON.parse(data));
            } else {
                resolve(null);
            }
        });
    });
}

export function setCachedQuestion(
    regionCode: string,
    question: Question,
    ttl: number
): Promise<void> {
    const cacheKey = `question:${regionCode}`;
    return new Promise((resolve, reject) => {
        memcached.set(cacheKey, JSON.stringify(question), ttl, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

export async function postQuestion(text: string) {
    return prisma.question.create({
        data: {
            text,
            createdAt: new Date(),
        }
    });
}

export async function attachQuestionToRegion(questionId: number, region: Region, startDateEpoch?: number) {
    let dates: { activeFrom: Date; activeTill: Date };
    // If startDateEpoch is provided, calculate active dates from that date
    if (startDateEpoch) {
        dates = calculateActiveDates(new Date(startDateEpoch), region.cycleDuration);
    } else {
        const lastQuestion = await prisma.questionRegions.findFirst({
            where: {
                regionId: region.id,
                activeTill: {gte: new Date()},
            },
            orderBy: {activeTill: 'desc'},
        });
        dates = calculateActiveDates(lastQuestion?.activeTill || new Date(), region.cycleDuration);
    }
    return prisma.questionRegions.create({
        data: {
            regionId: region.id,
            questionId,
            activeFrom: dates.activeFrom,
            activeTill: dates.activeTill,
        },
    });
}
