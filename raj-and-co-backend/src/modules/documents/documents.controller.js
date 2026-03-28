const prisma = require('../../config/db');
const { success, error } = require('../../utils/response');

const list = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { projectId, tenderId, workerId } = req.query;

    const where = { userId };
    if (projectId) where.projectId = projectId;
    if (tenderId) where.tenderId = tenderId;
    if (workerId) where.workerId = workerId;

    const data = await prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return success(res, data, 'Documents retrieved');
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const data = { ...req.body, userId };
    const doc = await prisma.document.create({ data });
    return success(res, doc, 'Document record created', 201);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const doc = await prisma.document.findFirst({ where: { id, userId } });
    if (!doc) return error(res, 'Document not found', 404);

    await prisma.document.delete({ where: { id } });
    return success(res, null, 'Document record deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { list, create, remove };
