const db = require('../config/db');

const getTransactions = async (req, res, next) => {
  try {
    const { project_id } = req.query;
    let query = 'SELECT * FROM accounts';
    let params = [];
    if (project_id) {
      query += ' WHERE project_id = $1';
      params.push(project_id);
    }
    query += ' ORDER BY date DESC';
    const { rows } = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const { project_id, type, category, amount, date, description } = req.body;
    const { rows } = await db.query(
      'INSERT INTO accounts (project_id, type, category, amount, date, description, added_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [project_id, type, category, amount, date, description, req.user.uid]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

const getAccountSummary = async (req, res, next) => {
  try {
    const { project_id } = req.query;
    let query = 'SELECT type, SUM(amount) as total FROM accounts ';
    let params = [];
    if (project_id) {
      query += ' WHERE project_id = $1';
      params.push(project_id);
    }
    query += ' GROUP BY type';
    const { rows } = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  getAccountSummary
};
