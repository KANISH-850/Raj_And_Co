const workersService = require('./workers.service');
const { success } = require('../../utils/response');

/**
 * List Controller
 */
const list = async (req, res, next) => {
  try {
    const data = await workersService.listWorkers(req.params.projectId);
    return success(res, data, 'Workers retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Create Controller
 */
const create = async (req, res, next) => {
  try {
    const data = await workersService.addWorker(req.params.projectId, req.body);
    return success(res, data, 'Worker added', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update Controller
 */
const update = async (req, res, next) => {
  try {
    const data = await workersService.updateWorker(req.params.id, req.body);
    return success(res, data, 'Worker updated');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete Controller
 */
const remove = async (req, res, next) => {
  try {
    await workersService.removeWorker(req.params.id);
    return success(res, null, 'Worker removed from project');
  } catch (err) {
    next(err);
  }
};

module.exports = { list, create, update, remove };
