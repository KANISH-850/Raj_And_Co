const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const userId = '88888888-4444-4444-4444-121212121212'; // Mock UUID
    
    // 1. Ensure user exists
    await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: { id: userId, email: 'test@example.com', name: 'Test User' }
    });

    const contractor = await prisma.contractor.create({
      data: {
        userId,
        name: 'Test Contractor',
        specialty: 'civil',
      }
    });
    console.log('✅ Contractor created:', contractor);
  } catch (err) {
    console.error('❌ Error creating contractor:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
