const db = require('../config/db');

const getAllExpenses = async (req, res, next) => {
  try {
    const { project_id } = req.query;
    let query = 'SELECT * FROM daily_expenses';
    let params = [];
    if (project_id) {
      query += ' WHERE project_id = $1';
      params.push(project_id);
    }
    const { rows } = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

const createExpense = async (req, res, next) => {
  try {
    const { project_id, date, category, description, amount } = req.body;
    const { rows } = await db.query(
      'INSERT INTO daily_expenses (project_id, date, category, description, amount, added_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [project_id, date, category, description, amount, req.user.uid]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    await db.query('DELETE FROM daily_expenses WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllExpenses,
  createExpense,
  deleteExpense
};
