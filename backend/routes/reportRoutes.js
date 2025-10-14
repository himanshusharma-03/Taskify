const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  exportTasksReport, // match name
  exportUserReport,
} = require("../controllers/reportController");

const router = express.Router();

router.get("/export/tasks", protect, adminOnly, exportTasksReport); //fixed
router.get("/export/users", protect, adminOnly, exportUserReport);

module.exports = router;
