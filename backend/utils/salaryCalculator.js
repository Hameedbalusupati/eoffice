const generatePDF = require("../utils/generatePDF");
const { pool } = require("../config/db");

exports.downloadSalarySlip = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT f.name, f.email, f.department, f.designation,
              s.basic, s.hra, s.deductions, s.net_salary
       FROM salary s
       JOIN faculty f ON f.id = s.faculty_id
       WHERE s.id = $1`,
      [id]
    );

    const data = result.rows[0];

    if (!data) return res.status(404).json({ msg: "Not found" });

    generatePDF(res, data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};