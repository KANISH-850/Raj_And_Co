const prisma = require('../../config/db');

/**
 * List workers in a project
 */
const listWorkers = async (projectId) => {
  return await prisma.worker.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Add worker to project
 */
const addWorker = async (projectId, payload) => {
  return await prisma.worker.create({
    data: {
      projectId,
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
const updateWorker = async (id, payload) => {
  return await prisma.worker.update({
    where: { id },
    data: {
      ...payload,
      joinedDate: payload.joinedDate ? new Date(payload.joinedDate) : undefined,
    },
  });
};

/**
 * Remove worker
 */
const removeWorker = async (id) => {
  return await prisma.worker.delete({ where: { id } });
};

module.exports = { listWorkers, addWorker, updateWorker, removeWorker };
