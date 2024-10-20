import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()


async function main() {

    const questions = await prisma.question.createMany({
        data: new Array(10).fill(0).map((_, i) => ({
            id: i + 1,
            text: `Question ${i + 1}`,
            createdAt: new Date(),
        }))
    })
    const SgRegion = await prisma.region.create({
        data: {
            cycleDuration: 7,
            code: 'SG',
            name: 'Singapore',
        }
    })

    const TwRegion = await prisma.region.create({
        data: {
            cycleDuration: 3,
            code: 'TW',
            name: 'Taiwan',
        }
    })
}


main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
