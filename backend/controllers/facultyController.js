const { pool } = require("../config/db");


// ✅ Create Faculty
exports.createFaculty = async (req, res) => {
  const { name, email, department, designation, salary } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO faculty (name, email, department, designation, salary)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, email, department, designation, salary]
    );

    res.status(201).json({
      message: "Faculty created successfully",
      faculty: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Get All Faculty
exports.getAllFaculty = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM faculty ORDER BY id DESC");

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Get Single Faculty
exports.getFacultyById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM faculty WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Update Faculty
exports.updateFaculty = async (req, res) => {
  const { id } = req.params;
  const { name, email, department, designation, salary } = req.body;

  try {
    const result = await pool.query(
      `UPDATE faculty
       SET name=$1, email=$2, department=$3, designation=$4, salary=$5
       WHERE id=$6
       RETURNING *`,
      [name, email, department, designation, salary, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.json({
      message: "Faculty updated successfully",
      faculty: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Delete Faculty
exports.deleteFaculty = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM faculty WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.json({
      message: "Faculty deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};