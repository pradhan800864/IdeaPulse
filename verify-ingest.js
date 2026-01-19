
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const lastJob = await prisma.jobRun.findFirst({
        orderBy: { startedAt: 'desc' }
    })
    console.log('Last Job Run:', JSON.stringify(lastJob, null, 2))
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
