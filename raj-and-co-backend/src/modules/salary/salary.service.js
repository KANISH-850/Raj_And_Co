const prisma = require('../../config/db');

/**
 * List all salary records with filter by month/project
 */
const list = async ({ month, projectId }) => {
  const where = {};
  if (month) where.month = month;
  if (projectId) where.projectId = projectId;
  
  return await prisma.salary.findMany({
    where,
    include: {
      worker: { select: { name: true, role: true } },
      project: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Create salary record
 */
const create = async (payload) => {
  return await prisma.salary.create({
    data: {
      projectId: payload.projectId,
      workerId: payload.workerId,
      month: payload.month,
      amount: payload.amount,
      isPaid: payload.isPaid || false,
      paidOn: payload.paidOn ? new Date(payload.paidOn) : null,
    },
  });
};

/**
 * Update record
 */
const update = async (id, payload) => {
  return await prisma.salary.update({
    where: { id },
    data: {
      ...payload,
      paidOn: payload.paidOn ? new Date(payload.paidOn) : undefined,
    },
  });
};

/**
 * Mark salary as paid
 */
const markPaid = async (id) => {
  return await prisma.salary.update({
    where: { id },
    data: {
      isPaid: true,
      paidOn: new Date(),
    },
  });
};

/**
 * Delete record
 */
const remove = async (id) => {
  return await prisma.salary.delete({ where: { id } });
};

module.exports = { list, create, update, markPaid, remove };
