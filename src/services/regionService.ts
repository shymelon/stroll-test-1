import {PrismaClient, Region} from '@prisma/client';

const prisma = new PrismaClient();

export async function getRegionByCode(regionCode: string): Promise<Region> {
    const region = await prisma.region.findUnique({
        where: {code: regionCode},
    });
    if (!region) {
        throw new Error(`Region with code ${regionCode} not found.`);
    }
    return region;
}

export function calculateActiveDates(lastActiveTill: Date, duration: number): {
    activeFrom: Date;
    activeTill: Date;
} {
    const activeFrom = new Date(lastActiveTill);
    const activeTill = new Date(activeFrom.getTime() + duration * 24 * 60 * 60 * 1000);
    return {activeFrom, activeTill};
}

export async function updateRegion(id: number, data: Partial<{ cycleDuration: number, name: string }>): Promise<Region> {
    return prisma.region.update({
        where: {id},
        data,
    });
}
