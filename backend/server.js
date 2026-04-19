const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware — allow Vite on localhost or 127.0.0.1, any port (CORS is bypassed if you use the Vite proxy in dev)
const corsOptions =
  process.env.CORS_ORIGIN === "true" || !process.env.CORS_ORIGIN
    ? { origin: true, credentials: true }
    : { origin: process.env.CORS_ORIGIN, credentials: true };
app.use(cors(corsOptions));
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

const db = require("./config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await db.ensureUserSchema();
  } catch (err) {
    console.error("⚠️ Schema check (users columns):", err.message);
  }
  app.listen(PORT, () => {
    console.log(`🌱 SmartAgri API running on http://localhost:${PORT}`);
  });
}

start();
