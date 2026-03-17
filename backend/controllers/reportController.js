const { pool } = require("../config/db");

exports.getReports = async (req, res) => {
  const result = await pool.query(`
    SELECT f.name, s.net_salary, s.created_at
    FROM salary s
    JOIN faculty f ON f.id = s.faculty_id
  `);

  res.json(result.rows);
};