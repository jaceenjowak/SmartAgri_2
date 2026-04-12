const db = require("../config/db");

// POST /api/irrigation/control — manual pump on/off
const controlPump = async (req, res) => {
  const { action } = req.body; // 'on' or 'off'

  if (!["on", "off"].includes(action)) {
    return res.status(400).json({ message: 'Action must be "on" or "off"' });
  }

  try {
    const isOn = action === "on";
    await db.query("UPDATE pump_state SET is_on = ? WHERE id = 1", [isOn]);

    // Log the manual action
    const [latestReading] = await db.query(
      "SELECT moisture_percent FROM sensor_readings WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [req.user.id],
    );

    const moisture = latestReading[0]?.moisture_percent || null;
    await db.query(
      'INSERT INTO irrigation_logs (user_id, action, trigger_type, moisture_at_trigger) VALUES (?, ?, "manual", ?)',
      [req.user.id, action, moisture],
    );

    // Create notification
    const msg =
      action === "on"
        ? "Irrigation pump manually turned ON."
        : "Irrigation pump manually turned OFF.";
    await db.query(
      "INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)",
      [req.user.id, msg, action === "on" ? "pump_on" : "pump_off"],
    );

    res.json({ message: `Pump turned ${action}`, pump_on: isOn });
  } catch (err) {
    console.error("Pump control error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/irrigation/logs — get irrigation history
const getLogs = async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  try {
    const [rows] = await db.query(
      `SELECT * FROM irrigation_logs WHERE user_id = ?
       ORDER BY created_at DESC LIMIT ?`,
      [req.user.id, limit],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/irrigation/pump-status
const getPumpStatus = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT is_on, updated_at FROM pump_state WHERE id = 1",
    );
    res.json(rows[0] || { is_on: false });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { controlPump, getLogs, getPumpStatus };
