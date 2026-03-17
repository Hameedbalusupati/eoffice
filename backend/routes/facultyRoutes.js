const router = require("express").Router();
const ctrl = require("../controllers/facultyController");
const auth = require("../middleware/authMiddleware");

router.use(auth);

router.post("/", ctrl.createFaculty);
router.get("/", ctrl.getAllFaculty);
router.put("/:id", ctrl.updateFaculty);
router.delete("/:id", ctrl.deleteFaculty);

module.exports = router;