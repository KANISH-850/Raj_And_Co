const prisma = require('../../config/db');

/**
 * List workers in a project
 */
const listWorkers = async (projectId, userId) => {
  return await prisma.worker.findMany({
    where: { projectId, userId },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Add worker to project
 */
const addWorker = async (projectId, userId, payload) => {
  return await prisma.worker.create({
    data: {
      projectId,
      userId,
      name: payload.name,
      role: payload.role,
      dailyWage: payload.dailyWage,
      joinedDate: payload.joinedDate ? new Date(payload.joinedDate) : null,
    },
  });
};

/**
 * Update worker
 */
const updateWorker = async (id, userId, payload) => {
  return await prisma.worker.update({
    where: { id, userId },
    data: {
      ...payload,
      joinedDate: payload.joinedDate ? new Date(payload.joinedDate) : undefined,
    },
  });
};

/**
 * Remove worker
 */
const removeWorker = async (id, userId) => {
  return await prisma.worker.delete({ where: { id, userId } });
};

module.exports = { listWorkers, addWorker, updateWorker, removeWorker };
