const prisma = require('../../config/db');

/**
 * List expenses for a project
 */
const listExpenses = async (projectId, userId, { dateFrom, dateTo, category }) => {
  const where = { projectId, userId };
  if (category) where.category = category;
  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) where.date.gte = new Date(dateFrom);
    if (dateTo) where.date.lte = new Date(dateTo);
  }
  return await prisma.expense.findMany({
    where,
    orderBy: { date: 'desc' },
  });
};

/**
 * Add expense to project
 */
const addExpense = async (projectId, userId, payload) => {
  return await prisma.expense.create({
    data: {
      projectId,
      userId,
      date: new Date(payload.date),
      category: payload.category,
      description: payload.description,
      amount: payload.amount,
    },
  });
};

/**
 * Update expense
 */
const updateExpense = async (id, userId, payload) => {
  return await prisma.expense.update({
    where: { id, userId },
    data: {
      ...payload,
      date: payload.date ? new Date(payload.date) : undefined,
    },
  });
};

/**
 * Delete expense
 */
const removeExpense = async (id, userId) => {
  return await prisma.expense.delete({ where: { id, userId } });
};

/**
 * Get expense summary across all projects
 */
const getSummary = async (userId) => {
  const grouped = await prisma.expense.groupBy({
    by: ['projectId', 'category'],
    where: { userId },
    _sum: { amount: true },
  });
  
  // Aggregate results by project
  const summary = {};
  grouped.forEach(item => {
    if (!summary[item.projectId]) {
      summary[item.projectId] = { total: 0, byCategory: {} };
    }
    summary[item.projectId].byCategory[item.category] = item._sum.amount;
    summary[item.projectId].total += item._sum.amount;
  });
  
  return summary;
};

module.exports = { listExpenses, addExpense, updateExpense, removeExpense, getSummary };
