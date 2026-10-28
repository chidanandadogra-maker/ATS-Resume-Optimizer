const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
      getResumeHistory,
      createResumeHistory,
} = require("../controllers/resumeController");
router.get("/history", protect, getResumeHistory);
router.post("/history", protect, createResumeHistory);

module.exports = router;