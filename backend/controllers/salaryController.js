const { pool } = require("../config/db");

exports.generateSalary = async (req, res) => {
  const { faculty_id, basic, hra, deductions } = req.body;

  try {
    const net_salary = basic + hra - deductions;

    const result = await pool.query(
      `INSERT INTO salary (faculty_id, basic, hra, deductions, net_salary)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [faculty_id, basic, hra, deductions, net_salary]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSalaries = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM salary");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.downloadSalarySlip = async (req, res) => {
  res.json({ msg: "PDF feature working" });
};