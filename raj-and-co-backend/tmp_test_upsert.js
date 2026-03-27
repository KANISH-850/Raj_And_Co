const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testUpsert() {
  try {
    const id = '88888888-4444-4444-4444-121212121212';
    const res = await prisma.user.upsert({
      where: { id },
      update: { email: 'test@example.com' },
      create: { id, email: 'test@example.com', name: 'Test' }
    });
    console.log('✅ Upsert res:', res);
  } catch (err) {
    console.error('❌ Upsert error:', err);
  } finally {
    await prisma.$disconnect();
  }
}
testUpsert();
