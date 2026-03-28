const prisma = require('../../config/db');

const list = async (userId) => {
  return await prisma.selectedTender.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

const create = async (userId, payload) => {
  return await prisma.selectedTender.create({
    data: {
      userId,
      tenderNumber: payload.tenderNumber || `TN-${Date.now()}`,
      title: payload.title,
      department: payload.department || null,
      estimatedValue: payload.estimatedValue ? parseFloat(payload.estimatedValue) : null,
      source: payload.source || null,
      notes: payload.notes || null,
      status: 'SELECTED',
    },
  });
};

const updateStatus = async (id, userId, status) => {
  return await prisma.selectedTender.update({
    where: { id, userId },
    data: { status },
  });
};

const remove = async (id, userId) => {
  return await prisma.selectedTender.delete({ where: { id, userId } });
};

module.exports = { list, create, updateStatus, remove };
