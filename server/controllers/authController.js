const db = require('../config/db');

const syncUser = async (req, res, next) => {
  try {
    const { uid, email, displayName } = req.body;
    const { rows } = await db.query(
      'INSERT INTO users (id, name, email) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET name = $2, email = $3 RETURNING *',
      [uid, displayName || 'User', email]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [req.user.uid]);
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncUser,
  getCurrentUser
};
