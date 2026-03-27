const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
    const expenses = await prisma.expense.count();
    const projects = await prisma.project.count();
    const tenders = await prisma.tender.count();
    console.log({ expenses, projects, tenders });
    process.exit(0);
}
run();
