const db = require('../config/db');

const Project = {
  async getAll() {
    const { rows } = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    return rows;
  },

  async getById(id) {
    const { rows } = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    return rows[0];
  },

  async create(projectData) {
    const { name, location, start_date, end_date, budget, created_by } = projectData;
    const { rows } = await db.query(
      'INSERT INTO projects (name, location, start_date, end_date, budget, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, location, start_date, end_date, budget, created_by]
    );
    return rows[0];
  },

  async update(id, updateData) {
    const { name, location, start_date, end_date, status, budget } = updateData;
    const { rows } = await db.query(
      'UPDATE projects SET name = $1, location = $2, start_date = $3, end_date = $4, status = $5, budget = $6 WHERE id = $7 RETURNING *',
      [name, location, start_date, end_date, status, budget, id]
    );
    return rows[0];
  },

  async delete(id) {
    await db.query('DELETE FROM projects WHERE id = $1', [id]);
    return { message: 'Project deleted successfully' };
  }
};

module.exports = Project;
