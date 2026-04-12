const db = require("../config/db");

// POST /api/sensor/reading — ESP32 sends data here
const postReading = async (req, res) => {
  const { user_id, moisture_percent, temperature, water_tank_level } = req.body;

  if (moisture_percent === undefined) {
    return res.status(400).json({ message: "moisture_percent is required" });
  }

  try {
    await db.query(
      "INSERT INTO sensor_readings (user_id, moisture_percent, temperature, water_tank_level) VALUES (?, ?, ?, ?)",
      [
        user_id || null,
        moisture_percent,
        temperature || null,
        water_tank_level || null,
      ],
    );

    // Check threshold and auto-irrigate if needed
    const [thresholds] = await db.query(
      "SELECT * FROM thresholds WHERE user_id = ?",
      [user_id],
    );

    if (thresholds.length > 0 && thresholds[0].auto_irrigation) {
      const { dry_threshold, wet_threshold } = thresholds[0];
      const [pumpState] = await db.query(
        "SELECT is_on FROM pump_state WHERE id = 1",
      );
      const pumpOn = pumpState[0].is_on;

      // Auto-ON: soil is too dry and pump is off
      if (moisture_percent < dry_threshold && !pumpOn) {
        await db.query("UPDATE pump_state SET is_on = TRUE WHERE id = 1");
        await db.query(
          'INSERT INTO irrigation_logs (user_id, action, trigger_type, moisture_at_trigger) VALUES (?, "on", "auto", ?)',
          [user_id, moisture_percent],
        );
        await db.query(
          'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, "dry_alert")',
          [
            user_id,
            `Soil moisture is ${moisture_percent}% — below threshold. Auto-irrigation activated.`,
          ],
        );
      }

      // Auto-OFF: soil is sufficiently wet and pump is on
      if (moisture_percent >= wet_threshold && pumpOn) {
        await db.query("UPDATE pump_state SET is_on = FALSE WHERE id = 1");
        await db.query(
          'INSERT INTO irrigation_logs (user_id, action, trigger_type, moisture_at_trigger) VALUES (?, "off", "auto", ?)',
          [user_id, moisture_percent],
        );
        await db.query(
          'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, "pump_off")',
          [
            user_id,
            `Soil reached ${moisture_percent}% moisture. Auto-irrigation stopped.`,
          ],
        );
      }
    }

    // Calculate water suggestion (liters needed based on moisture deficit)
    const deficit = Math.max(0, 60 - moisture_percent); // Target 60%
    const waterNeeded = parseFloat((deficit * 0.1).toFixed(2)); // Simplified formula

    res.status(201).json({
      message: "Reading saved",
      water_suggestion_liters: waterNeeded,
    });
  } catch (err) {
    console.error("Sensor post error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/sensor/latest — get most recent reading for dashboard
const getLatest = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM sensor_readings WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [req.user.id],
    );
    const [pumpState] = await db.query(
      "SELECT is_on FROM pump_state WHERE id = 1",
    );

    // Calculate water needed based on latest moisture
    const moisture = rows[0]?.moisture_percent || 0;
    const deficit = Math.max(0, 60 - moisture);
    const waterNeeded = parseFloat((deficit * 0.1).toFixed(2));

    res.json({
      reading: rows[0] || null,
      pump_on: pumpState[0]?.is_on || false,
      water_to_sprinkle: waterNeeded,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/sensor/history — last N readings for chart
const getHistory = async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  try {
    const [rows] = await db.query(
      "SELECT moisture_percent, temperature, water_tank_level, created_at FROM sensor_readings WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
      [req.user.id, limit],
    );
    res.json(rows.reverse()); // chronological order for chart
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/sensor/all — admin: see all readings
const getAllReadings = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT sr.*, u.username FROM sensor_readings sr
       LEFT JOIN users u ON sr.user_id = u.id
       ORDER BY sr.created_at DESC LIMIT 100`,
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { postReading, getLatest, getHistory, getAllReadings };
