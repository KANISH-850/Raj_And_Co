const prisma = require('../../config/db');

/**
 * Get aggregated dashboard overview for a user
 */
const getOverview = async (userId) => {
  // Parallel fetch for stats
  const [activeProjects, totalProjects, totalTenders, totalExpense, unpaidSalary] = await Promise.all([
    prisma.project.count({ where: { userId, status: 'active' } }),
    prisma.project.count({ where: { userId } }),
    prisma.tender.count({ where: { userId, status: 'submitted' } }),
    prisma.expense.aggregate({ where: { userId }, _sum: { amount: true } }),
    prisma.salary.aggregate({ where: { userId, isPaid: false }, _sum: { amount: true } })
  ]);

  // Fetch recent activities (concatenated list of projects & expenses)
  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const expenses = await prisma.expense.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { project: { select: { name: true } } }
  });

  const activities = [
    ...projects.map(p => ({
      id: p.id,
      type: 'project',
      title: 'New Site Initialized',
      desc: `Site: ${p.name} at ${p.location}`,
      date: p.createdAt
    })),
    ...expenses.map(e => ({
      id: e.id,
      type: 'expense',
      title: 'Payment Processed',
      desc: `${e.category}: ${e.description} (Site: ${e.project?.name || 'N/A'})`,
      date: e.createdAt
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return {
    stats: {
      activeProjects,
      totalProjects,
      totalTenders,
      totalExpense: totalExpense._sum.amount || 0,
      unpaidSalary: unpaidSalary._sum.amount || 0
    },
    activities
  };
};

/**
 * Seed data for a specific user
 */
const seedDataForUser = async (userId) => {
  const count = await prisma.project.count({ where: { userId } });
  if (count > 0) return { message: 'Existing data detected. Seed bypassed.' };

  const project1 = await prisma.project.create({
    data: {
      userId,
      name: 'Raj & Co Central Mall',
      location: 'Koramanagala, Bangalore',
      type: 'commercial',
      status: 'active',
      startDate: new Date('2024-01-01'),
      tenderRef: 'TNDR-BLR-889'
    }
  });

  const project2 = await prisma.project.create({
    data: {
      userId,
      name: 'NH-44 Highway Overpass',
      location: 'Bengaluru Highway, KA',
      type: 'government',
      status: 'active',
      startDate: new Date('2024-02-15'),
      tenderRef: 'GOV-NHAI-776'
    }
  });

  await prisma.worker.createMany({
    data: [
      { projectId: project1.id, userId, name: 'Siva Murugan', role: 'Mason', dailyWage: 850, joinedDate: new Date() },
      { projectId: project1.id, userId, name: 'Ravi Teja', role: 'Electrician', dailyWage: 1100, joinedDate: new Date() },
      { projectId: project2.id, userId, name: 'Kumar Swami', role: 'Foreman', dailyWage: 1400, joinedDate: new Date() },
    ]
  });

  await prisma.expense.createMany({
    data: [
      { projectId: project1.id, userId, category: 'material', description: '500 Bags UltraTech Cement', amount: 185000, date: new Date() },
      { projectId: project1.id, userId, category: 'labour', description: 'Weekly wage settlement P1', amount: 42000, date: new Date() },
      { projectId: project2.id, userId, category: 'equipment', description: 'JCB Rent for Foundations', amount: 95000, date: new Date() },
    ]
  });

  await prisma.tender.createMany({
    data: [
      { projectId: project1.id, userId, title: 'Phase 2 Interior Fitting Bid', tenderValue: 4500000, status: 'approved' },
      { userId, title: 'Upcoming Airport Extension Bid', tenderValue: 18000000, status: 'submitted' },
    ]
  });

  return { message: 'Demo Environment Active' };
};

module.exports = { getOverview, seedDataForUser };
