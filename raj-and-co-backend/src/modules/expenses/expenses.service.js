const prisma = require('../../config/db');

/**
 * List expenses for a project
 */
const listExpenses = async (projectId, { dateFrom, dateTo, category }) => {
  const where = { projectId };
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
const addExpense = async (projectId, payload) => {
  return await prisma.expense.create({
    data: {
      projectId,
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
const updateExpense = async (id, payload) => {
  return await prisma.expense.update({
    where: { id },
    data: {
      ...payload,
      date: payload.date ? new Date(payload.date) : undefined,
    },
  });
};

/**
 * Delete expense
 */
const removeExpense = async (id) => {
  return await prisma.expense.delete({ where: { id } });
};

/**
 * Get expense summary across all projects
 */
const getSummary = async () => {
  const grouped = await prisma.expense.groupBy({
    by: ['projectId', 'category'],
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
