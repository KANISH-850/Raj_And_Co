const db = require('../config/db');

const getAllTenders = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM tenders ORDER BY submission_date DESC');
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

const createTender = async (req, res, next) => {
  try {
    const { project_id, tender_number, title, issued_by, submission_date, amount, notes } = req.body;
    const { rows } = await db.query(
      'INSERT INTO tenders (project_id, tender_number, title, issued_by, submission_date, amount, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [project_id, tender_number, title, issued_by, submission_date, amount, notes]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateTender = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { rows } = await db.query(
      'UPDATE tenders SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTenders,
  createTender,
  updateTender
};
