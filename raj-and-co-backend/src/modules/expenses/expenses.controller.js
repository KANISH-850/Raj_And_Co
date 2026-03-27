const expensesService = require('./expenses.service');
const { success } = require('../../utils/response');

/**
 * List Controller
 */
const list = async (req, res, next) => {
  try {
    const { category, dateFrom, dateTo } = req.query;
    const data = await expensesService.listExpenses(req.params.projectId, { category, dateFrom, dateTo });
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
    const data = await expensesService.addExpense(req.params.projectId, req.body);
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
    const data = await expensesService.updateExpense(req.params.id, req.body);
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
    await expensesService.removeExpense(req.params.id);
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
    const summary = await expensesService.getSummary();
    return success(res, summary, 'Expense global summary generated');
  } catch (err) {
    next(err);
  }
};

module.exports = { list, create, update, remove, getGlobalSummary };
