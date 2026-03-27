const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create User (Admin)
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rajandco.com' },
    update: {},
    create: {
      name: 'Raj Admin',
      email: 'admin@rajandco.com',
      password: hashedPassword,
    },
  });

  // 2. Create Project
  const project1 = await prisma.project.create({
    data: {
      name: 'NH-44 Highway Overpass',
      location: 'Bengaluru, KA',
      tenderRef: 'NHAI/2024/77',
      type: 'civil',
      startDate: new Date('2024-01-10'),
      status: 'active',
    },
  });

  // 3. Create Workers
  const worker1 = await prisma.worker.create({
    data: {
      projectId: project1.id,
      name: 'Suresh Kumar',
      role: 'Mason',
      dailyWage: 850,
      joinedDate: new Date('2024-01-15'),
    },
  });

  // 4. Create Expenses
  await prisma.expense.create({
    data: {
      projectId: project1.id,
      date: new Date('2024-02-15'),
      category: 'material',
      description: 'Central Supply Cement Payout',
      amount: 145000,
    },
  });

  // 5. Create Tenders
  await prisma.tender.create({
    data: {
      title: 'Phase 2 Metro Underground Cabling',
      tenderValue: 12000000,
      status: 'submitted',
      submittedDate: new Date('2024-03-01'),
    },
  });

  // 6. Create Contractors
  await prisma.contractor.createMany({
    data: [
      { name: 'Siva Electricals & Projects', specialty: 'electrical', rating: 4.8, contact: '9845012345', available: true },
      { name: 'Vibrant Civil Works', specialty: 'civil', rating: 4.2, contact: '8877665544', available: true },
    ],
  });

  console.log('🌵 Seed finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
