const tendersService = require('./tenders.service');
const { success } = require('../../utils/response');

/**
 * List Controller
 */
const list = async (req, res, next) => {
  try {
    const data = await tendersService.list({ status: req.query.status });
    return success(res, data, 'Tenders retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Create Controller
 */
const create = async (req, res, next) => {
  try {
    const data = await tendersService.create(req.body);
    return success(res, data, 'Tender created', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update Controller
 */
const update = async (req, res, next) => {
  try {
    const data = await tendersService.update(req.params.id, req.body);
    return success(res, data, 'Tender updated');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete Controller
 */
const remove = async (req, res, next) => {
  try {
    await tendersService.remove(req.params.id);
    return success(res, null, 'Tender deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { list, create, update, remove };
