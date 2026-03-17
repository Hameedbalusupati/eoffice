const router = require("express").Router();
const ctrl = require("../controllers/reportController");
const auth = require("../middleware/authMiddleware");

router.use(auth);

router.get("/", ctrl.getReports);

module.exports = router;