const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // Vite default port
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/sensor", require("./routes/sensorRoutes"));
app.use("/api/irrigation", require("./routes/irrigationRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/thresholds", require("./routes/thresholdRoutes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "SmartAgri API running", timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌱 SmartAgri API running on http://localhost:${PORT}`);
});
