const prisma = require('../../config/db');
const { success } = require('../../utils/response');

const search = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { q } = req.query;

    if (!q || q.length < 2) {
      return success(res, [], 'Query too short');
    }

    const [projects, tenders, workers] = await Promise.all([
      prisma.project.findMany({
        where: { userId, name: { contains: q, mode: 'insensitive' } },
        select: { id: true, name: true, type: true },
        take: 5
      }),
      prisma.selectedTender.findMany({
        where: { userId, title: { contains: q, mode: 'insensitive' } },
        select: { id: true, title: true, tenderNumber: true },
        take: 5
      }),
      prisma.worker.findMany({
        where: { userId, name: { contains: q, mode: 'insensitive' } },
        select: { id: true, name: true, role: true, projectId: true },
        take: 5
      })
    ]);

    const results = [
      ...projects.map(p => ({ id: p.id, type: 'Project', title: p.name, sub: p.type, url: `/projects/${p.id}` })),
      ...tenders.map(t => ({ id: t.id, type: 'Tender', title: t.title, sub: t.tenderNumber, url: '/tenders' })),
      ...workers.map(w => ({ id: w.id, type: 'Worker', title: w.name, sub: w.role, url: `/projects/${w.projectId}` }))
    ];

    return success(res, results, 'Search results retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = { search };
