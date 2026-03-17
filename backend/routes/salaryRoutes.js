const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/salaryController");

// ✅ IMPORTANT: all must exist in controller
router.post("/", ctrl.generateSalary);
router.get("/", ctrl.getSalaries);
router.get("/pdf/:id", ctrl.downloadSalarySlip);

module.exports = router;