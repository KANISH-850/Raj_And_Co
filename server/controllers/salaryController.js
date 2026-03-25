const db = require('../config/db');

const getSalaries = async (req, res, next) => {
  try {
    const { project_id, month, year } = req.query;
    let query = 'SELECT s.*, w.name as worker_name FROM salary s JOIN workers w ON s.worker_id = w.id';
    let params = [];
    let filter = [];
    if (project_id) {
      filter.push('s.project_id = $' + (params.length + 1));
      params.push(project_id);
    }
    if (month) {
      filter.push('s.month = $' + (params.length + 1));
      params.push(month);
    }
    if (year) {
      filter.push('s.year = $' + (params.length + 1));
      params.push(year);
    }
    if (filter.length > 0) {
      query += ' WHERE ' + filter.join(' AND ');
    }
    const { rows } = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

const calculateSalary = async (req, res, next) => {
  try {
    const { worker_id, project_id, month, year, days_worked, total_amount } = req.body;
    const { rows } = await db.query(
      'INSERT INTO salary (worker_id, project_id, month, year, days_worked, total_amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [worker_id, project_id, month, year, days_worked, total_amount]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

const markPaid = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'UPDATE salary SET paid = TRUE, paid_on = NOW() WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSalaries,
  calculateSalary,
  markPaid
};
