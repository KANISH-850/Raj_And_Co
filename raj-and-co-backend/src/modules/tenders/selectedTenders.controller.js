const selectedTendersService = require('./selectedTenders.service');
const { success } = require('../../utils/response');

const list = async (req, res, next) => {
  try {
    const data = await selectedTendersService.list(req.user.id);
    return success(res, data, 'Selected tenders retrieved');
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = await selectedTendersService.create(req.user.id, req.body);
    return success(res, data, 'Tender selected and saved', 201);
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const data = await selectedTendersService.updateStatus(req.params.id, req.user.id, req.body.status);
    return success(res, data, 'Tender status updated');
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await selectedTendersService.remove(req.params.id, req.user.id);
    return success(res, null, 'Selected tender removed');
  } catch (err) { next(err); }
};

module.exports = { list, create, updateStatus, remove };
