const prisma = require('../../config/db');

/**
 * List all projects with pagination and status filter
 */
const list = async ({ page, limit, skip, status }) => {
  const where = status ? { status } : {};
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
const create = async (payload) => {
  return await prisma.project.create({
    data: {
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
const getById = async (id) => {
  return await prisma.project.findUnique({
    where: { id },
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
const update = async (id, payload) => {
  return await prisma.project.update({
    where: { id },
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
const remove = async (id) => {
  return await prisma.project.delete({ where: { id } });
};

/**
 * Get project summary stats
 */
const getSummary = async (id) => {
  const [totalExpense, expensesByCategory, workerCount, unpaidSalaryCount] = await Promise.all([
    prisma.expense.aggregate({
      where: { projectId: id },
      _sum: { amount: true },
    }),
    prisma.expense.groupBy({
      by: ['category'],
      where: { projectId: id },
      _sum: { amount: true },
    }),
    prisma.worker.count({
      where: { projectId: id },
    }),
    prisma.salary.count({
      where: { projectId: id, isPaid: false },
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
