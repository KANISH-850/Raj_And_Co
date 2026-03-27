const expensesService = require('./expenses.service');
const { success } = require('../../utils/response');

/**
 * List Controller (Global)
 */
const listAll = async (req, res, next) => {
  try {
    const { category, dateFrom, dateTo } = req.query;
    const data = await expensesService.listAllExpenses(req.user.id, { category, dateFrom, dateTo });
    return success(res, data, 'All expenses retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * List Controller
 */
const list = async (req, res, next) => {
  try {
    const { category, dateFrom, dateTo } = req.query;
    const data = await expensesService.listExpenses(req.params.projectId, req.user.id, { category, dateFrom, dateTo });
    return success(res, data, 'Expenses retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Create Controller
 */
const create = async (req, res, next) => {
  try {
    const data = await expensesService.addExpense(req.params.projectId, req.user.id, req.body);
    return success(res, data, 'Expense added', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update Controller
 */
const update = async (req, res, next) => {
  try {
    const data = await expensesService.updateExpense(req.params.id, req.user.id, req.body);
    return success(res, data, 'Expense updated');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete Controller
 */
const remove = async (req, res, next) => {
  try {
    await expensesService.removeExpense(req.params.id, req.user.id);
    return success(res, null, 'Expense deleted');
  } catch (err) {
    next(err);
  }
};

/**
 * Summary Controller
 */
const getGlobalSummary = async (req, res, next) => {
  try {
    const summary = await expensesService.getSummary(req.user.id);
    return success(res, summary, 'Expense global summary generated');
  } catch (err) {
    next(err);
  }
};

module.exports = { list, listAll, create, update, remove, getGlobalSummary };
