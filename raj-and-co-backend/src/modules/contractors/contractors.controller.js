const contractorsService = require('./contractors.service');
const { success } = require('../../utils/response');

/**
 * List Controller
 */
const list = async (req, res, next) => {
  try {
    const { specialty, available } = req.query;
    const data = await contractorsService.list(req.user.id, { specialty, available });
    return success(res, data, 'Contractors retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Create Controller
 */
const create = async (req, res, next) => {
  try {
    const data = await contractorsService.create(req.user.id, req.body);
    return success(res, data, 'Contractor created', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update Controller
 */
const update = async (req, res, next) => {
  try {
    const data = await contractorsService.update(req.params.id, req.user.id, req.body);
    return success(res, data, 'Contractor updated');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete Controller
 */
const remove = async (req, res, next) => {
  try {
    await contractorsService.remove(req.params.id, req.user.id);
    return success(res, null, 'Contractor deleted');
  } catch (err) {
    next(err);
  }
};

/**
 * Suggest Controller
 */
const suggest = async (req, res, next) => {
  try {
    const specialty = req.query.specialty;
    const data = await contractorsService.suggestBySpecialty(specialty);
    return success(res, data, 'Contractor suggestions retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = { list, create, update, remove, suggest };
