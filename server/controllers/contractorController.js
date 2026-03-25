const db = require('../config/db');

const getAllContractors = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM contractors');
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

const getSuggestions = async (req, res, next) => {
  try {
    const { specialization, location } = req.query;
    let query = 'SELECT * FROM contractors WHERE available = TRUE';
    let params = [];
    if (specialization) {
      params.push(specialization);
      query += ' AND specialization = $' + params.length;
    }
    if (location) {
      params.push('%' + location + '%');
      query += ' AND location ILIKE $' + params.length;
    }
    query += ' ORDER BY rating DESC, past_projects DESC LIMIT 5';
    const { rows } = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContractors,
  getSuggestions
};
