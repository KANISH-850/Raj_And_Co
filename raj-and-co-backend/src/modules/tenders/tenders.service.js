const prisma = require('../../config/db');

/**
 * List all tenders with status filter
 */
const list = async ({ status }) => {
  const where = status ? { status } : {};
  return await prisma.tender.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Create a new tender
 */
const create = async (payload) => {
  return await prisma.tender.create({
    data: {
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
const update = async (id, payload) => {
  return await prisma.tender.update({
    where: { id },
    data: {
      ...payload,
      submittedDate: payload.submittedDate ? new Date(payload.submittedDate) : undefined,
    },
  });
};

/**
 * Delete tender
 */
const remove = async (id) => {
  return await prisma.tender.delete({ where: { id } });
};

module.exports = { list, create, update, remove };
