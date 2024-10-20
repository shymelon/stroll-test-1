import {getRegionByCode} from "../services/regionService";
import {
    attachQuestionToRegion,
    getCachedQuestion,
    getCurrentQuestion,
    postQuestion,
    setCachedQuestion
} from "../services/questionService";
import {FastifyReply, FastifyRequest} from "fastify";

export default class QuestionController {

    public static async getQuestionByRegionCode(request: FastifyRequest, reply: FastifyReply) {
        const regionCode = request.headers['x-region'] as string;

        if (!regionCode) {
            return reply.status(400).send({error: 'Region code is required.'});
        }

        try {
            const region = await getRegionByCode(regionCode);
            if (!region) {
                return reply.status(404).send({error: 'Region not found.'});
            }

            let question = await getCachedQuestion(regionCode);
            if (!question) {
                const questionRelation = await getCurrentQuestion(regionCode);
                question = questionRelation.question;
                // Cache the question for the remaining time it is active, in seconds
                const ttl = Math.floor((questionRelation.activeTill.getTime() - new Date().getTime())/1000);
                await setCachedQuestion(regionCode, question, ttl);
            }


            reply.send(question);
        } catch (error) {
            console.error(error);
            reply.status(500).send({error: 'Unable to fetch question.'});
        }
    }

    public static async postQuestion(request: FastifyRequest<{ Body: { text: string } }>, reply: FastifyReply) {
        const payload = request.body;

        try {
            const question = await postQuestion(payload.text);
            reply.send(question);
        } catch (error) {
            console.error(error);
            reply.status(500).send({error: 'Unable to create question.'});
        }
    }

    public static async attachQuestionToRegion(request: FastifyRequest<{
        Body: { regionCode: string, questionId: number, startDateEpoch?: number }
    }>, reply: FastifyReply) {
        const payload = request.body;

        try {
            const region = await getRegionByCode(payload.regionCode);
            if (!region) {
                return reply.status(404).send({error: 'Region not found.'});
            }
            await attachQuestionToRegion(payload.questionId, region, payload.startDateEpoch);
            reply.send({message: 'Question attached to region.'});
        } catch (error) {
            console.error(error);
            reply.status(500).send({error: 'Unable to attach question to region.'});
        }
    }
}
