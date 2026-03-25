const db = require('../config/db');

const getAllWorkers = async (req, res, next) => {
  try {
    const { project_id } = req.query;
    let query = 'SELECT * FROM workers';
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

const createWorker = async (req, res, next) => {
  try {
    const { project_id, name, role, daily_wage, joined_date, contact } = req.body;
    const { rows } = await db.query(
      'INSERT INTO workers (project_id, name, role, daily_wage, joined_date, contact) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [project_id, name, role, daily_wage, joined_date, contact]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteWorker = async (req, res, next) => {
  try {
    await db.query('DELETE FROM workers WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllWorkers,
  createWorker,
  deleteWorker
};
