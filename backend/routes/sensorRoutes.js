const express = require("express");
const router = express.Router();
const {
  postReading,
  getLatest,
  getHistory,
  getAllReadings,
} = require("../controllers/sensorController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/reading", postReading); // ESP32 posts here (no auth needed)
router.get("/latest", protect, getLatest);
router.get("/history", protect, getHistory);
router.get("/all", protect, adminOnly, getAllReadings);

module.exports = router;
