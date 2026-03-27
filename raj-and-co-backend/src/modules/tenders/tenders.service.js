const prisma = require('../../config/db');

/**
 * List all tenders with status filter
 */
const list = async (userId, { status }) => {
  const where = { userId };
  if (status) where.status = status;
  return await prisma.tender.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Create a new tender
 */
const create = async (userId, payload) => {
  return await prisma.tender.create({
    data: {
      userId,
      projectId: payload.projectId || null,
      title: payload.title,
      tenderValue: payload.tenderValue,
      status: payload.status || 'submitted',
      submittedDate: payload.submittedDate ? new Date(payload.submittedDate) : null,
    },
  });
};

/**
 * Update tender
 */
const update = async (id, userId, payload) => {
  return await prisma.tender.update({
    where: { id, userId },
    data: {
      ...payload,
      submittedDate: payload.submittedDate ? new Date(payload.submittedDate) : undefined,
    },
  });
};

/**
 * Delete tender
 */
const remove = async (id, userId) => {
  return await prisma.tender.delete({ where: { id, userId } });
};

module.exports = { list, create, update, remove };
