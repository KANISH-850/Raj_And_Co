const prisma = require('../../config/db');

/**
 * Get aggregated dashboard overview for a user with smart intelligence
 */
const getOverview = async (userId) => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const next48h = new Date(now);
  next48h.setDate(next48h.getDate() + 2);

  // Parallel fetch for stats and alerts
  const [
    activeProjects, 
    totalProjects, 
    totalTenders, 
    totalExpense, 
    unpaidSalary,
    unpaidSalaryCount,
    upcomingTenders,
    projectsWithExpenses
  ] = await Promise.all([
    prisma.project.count({ where: { userId, status: 'active' } }),
    prisma.project.count({ where: { userId } }),
    prisma.tender.count({ where: { userId, status: 'submitted' } }),
    prisma.expense.aggregate({ where: { userId }, _sum: { amount: true } }),
    prisma.salary.aggregate({ where: { userId, isPaid: false }, _sum: { amount: true } }),
    prisma.salary.count({ where: { userId, isPaid: false } }),
    prisma.selectedTender.findMany({
      where: { 
        userId, 
        deadline: { lte: next48h, gte: now },
        status: { notIn: ['WON', 'LOST'] }
      }
    }),
    prisma.project.findMany({
      where: { userId, status: 'active' },
      include: { 
        expenses: { select: { amount: true } },
        _count: { select: { workers: true } }
      }
    })
  ]);

  // Alert Generation Logic
  const alerts = [];
  
  // 1. Tender Deadlines
  upcomingTenders.forEach(t => {
    alerts.push({
      type: 'warning',
      category: 'Tender',
      message: `Tender deadline tomorrow: ${t.title}`,
      action: '/tenders'
    });
  });

  // 2. Salary Pending
  if (unpaidSalaryCount > 0) {
    alerts.push({
      type: 'info',
      category: 'Payroll',
      message: `Salary pending for ${unpaidSalaryCount} members`,
      action: '/salary'
    });
  }

  // 3. Project Budget Alerts
  let mostExpensiveProject = null;
  let maxExpense = 0;

  projectsWithExpenses.forEach(p => {
    const spent = p.expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const budget = parseFloat(p.tenderRef || 0);

    if (spent > maxExpense) {
      maxExpense = spent;
      mostExpensiveProject = { name: p.name, spent };
    }

    if (budget > 0) {
        if (spent > budget) {
            alerts.push({
                type: 'danger',
                category: 'Budget',
                message: `Expense exceeded budget: ${p.name}`,
                action: `/projects/${p.id}`
            });
        } else if (budget - spent < 50000) {
            alerts.push({
                type: 'warning',
                category: 'Budget',
                message: `Low balance on ${p.name}: ₹${(budget-spent).toLocaleString()} left`,
                action: `/projects/${p.id}`
            });
        }
    }
  });

  // Intel Summary
  const intel = {
    topPriority: upcomingTenders.length > 0 ? `${upcomingTenders.length} tenders need action` : "No urgent deadlines",
    mostExpensive: mostExpensiveProject ? `${mostExpensiveProject.name} (₹${mostExpensiveProject.spent.toLocaleString()})` : "N/A",
    pendingActions: alerts.length,
    cashFlowTrend: "Stable" // Mock trend for now
  };

  // Fetch recent activities
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
    activities,
    alerts: alerts.slice(0, 5),
    intel
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
      tenderRef: '5000000'
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
      tenderRef: '12000000'
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

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.selectedTender.create({
    data: {
        userId,
        title: 'Airport Cargo Terminal - Phase 4',
        tenderNumber: 'BNG-AIR-009',
        department: 'AAI',
        estimatedValue: 45000000,
        deadline: tomorrow,
        status: 'SELECTED',
        priority: 'high'
    }
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
