const prisma = require('../../config/db');

/**
 * List with automation: If deadline passed, auto-close
 */
const list = async (userId) => {
  const now = new Date();
  
  // Auto-close expired tenders
  await prisma.selectedTender.updateMany({
    where: { 
      userId, 
      deadline: { lt: now },
      status: { notIn: ['WON', 'LOST', 'CLOSED'] }
    },
    data: { status: 'CLOSED' }
  });

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
      deadline: payload.deadline ? new Date(payload.deadline) : null,
      source: payload.source || null,
      notes: payload.notes || null,
      status: 'SELECTED',
      priority: payload.priority || 'medium'
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
