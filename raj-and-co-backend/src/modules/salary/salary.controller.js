const salaryService = require('./salary.service');
const { success } = require('../../utils/response');

/**
 * List Controller
 */
const list = async (req, res, next) => {
  try {
    const { month, projectId } = req.query;
    const data = await salaryService.list({ month, projectId });
    return success(res, data, 'Salary records retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Create Controller
 */
const create = async (req, res, next) => {
  try {
    const data = await salaryService.create(req.body);
    return success(res, data, 'Salary record created', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update Controller
 */
const update = async (req, res, next) => {
  try {
    const data = await salaryService.update(req.params.id, req.body);
    return success(res, data, 'Salary record updated');
  } catch (err) {
    next(err);
  }
};

/**
 * Mark Paid Controller
 */
const markPaid = async (req, res, next) => {
  try {
    const data = await salaryService.markPaid(req.params.id);
    return success(res, data, 'Salary marked as paid');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete Controller
 */
const remove = async (req, res, next) => {
  try {
    await salaryService.remove(req.params.id);
    return success(res, null, 'Salary record deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { list, create, update, markPaid, remove };
