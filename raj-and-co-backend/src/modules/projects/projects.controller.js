const projectsService = require('./projects.service');
const { success, paginated, error } = require('../../utils/response');
const { getPagination } = require('../../utils/pagination');

/**
 * List Controller
 */
const list = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { total, data } = await projectsService.list({ 
      page, limit, skip, status: req.query.status, userId: req.user.id 
    });
    return paginated(res, data, page, limit, total, 'Projects retrieved');
  } catch (err) {
    console.error("SERVER CRASH:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message
    });
  }
};

/**
 * Create Controller
 */
const create = async (req, res, next) => {
  try {
    const data = await projectsService.create(req.body, req.user.id);
    return success(res, data, 'Project created', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Get Controller
 */
const getById = async (req, res, next) => {
  try {
    const data = await projectsService.getById(req.params.id, req.user.id);
    if (!data) return error(res, 'Project not found', 404);
    return success(res, data, 'Project retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Update Controller
 */
const update = async (req, res, next) => {
  try {
    const data = await projectsService.update(req.params.id, req.user.id, req.body);
    return success(res, data, 'Project updated');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete Controller
 */
const remove = async (req, res, next) => {
  try {
    await projectsService.remove(req.params.id, req.user.id);
    return success(res, null, 'Project deleted');
  } catch (err) {
    next(err);
  }
};

/**
 * Summary Controller
 */
const getSummary = async (req, res, next) => {
  try {
    const stats = await projectsService.getSummary(req.params.id, req.user.id);
    return success(res, stats, 'Project summary summary generated');
  } catch (err) {
    next(err);
  }
};

module.exports = { list, create, getById, update, remove, getSummary };
