const prisma = require('../../config/db');

/**
 * List all projects with pagination and status filter
 */
const list = async ({ page, limit, skip, status, userId }) => {
  const where = { userId };
  if (status) where.status = status;
  const [total, data] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
  ]);
  return { total, data };
};

/**
 * Create a new project
 */
const create = async (payload, userId) => {
  return await prisma.project.create({
    data: {
      userId,
      name: payload.name,
      location: payload.location,
      tenderRef: payload.tenderRef,
      type: payload.type,
      startDate: payload.startDate ? new Date(payload.startDate) : null,
      endDate: payload.endDate ? new Date(payload.endDate) : null,
      status: payload.status || 'active',
    },
  });
};

/**
 * Get project by ID
 */
const getById = async (id, userId) => {
  return await prisma.project.findUnique({
    where: { id, userId },
    include: {
      _count: {
        select: { workers: true, expenses: true, tenders: true, salaries: true },
      },
    },
  });
};

/**
 * Update project
 */
const update = async (id, userId, payload) => {
  return await prisma.project.update({
    where: { id, userId },
    data: {
      ...payload,
      startDate: payload.startDate ? new Date(payload.startDate) : undefined,
      endDate: payload.endDate ? new Date(payload.endDate) : undefined,
    },
  });
};

/**
 * Delete project
 */
/**
 * Delete project (Cascade delete children manually due to DB settings)
 */
const remove = async (id, userId) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Delete dependent records first to satisfy foreign key constraints
    await tx.document.deleteMany({ where: { projectId: id, userId } });
    await tx.expense.deleteMany({ where: { projectId: id, userId } });
    await tx.salary.deleteMany({ where: { projectId: id, userId } });
    await tx.tender.updateMany({ 
      where: { projectId: id, userId }, 
      data: { projectId: null } // Optional: or delete them. Let's disconnect them to preserve tender history.
    });
    await tx.worker.deleteMany({ where: { projectId: id, userId } });
    
    // 2. Finally delete the project
    return await tx.project.delete({ 
      where: { id, userId } 
    });
  });
};

/**
 * Get project summary stats
 */
const getSummary = async (id, userId) => {
  const [totalExpense, expensesByCategory, workerCount, unpaidSalaryCount] = await Promise.all([
    prisma.expense.aggregate({
      where: { projectId: id, userId },
      _sum: { amount: true },
    }),
    prisma.expense.groupBy({
      by: ['category'],
      where: { projectId: id, userId },
      _sum: { amount: true },
    }),
    prisma.worker.count({
      where: { projectId: id, userId },
    }),
    prisma.salary.count({
      where: { projectId: id, userId, isPaid: false },
    }),
  ]);

  return {
    totalSpent: totalExpense._sum.amount || 0,
    expensesByCategory: expensesByCategory.map((e) => ({
      category: e.category,
      amount: e._sum.amount,
    })),
    workerCount,
    unpaidSalaries: unpaidSalaryCount,
  };
};

module.exports = { list, create, getById, update, remove, getSummary };
