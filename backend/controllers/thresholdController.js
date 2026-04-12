const db = require("../config/db");

// GET /api/thresholds — get current user's thresholds
const getThresholds = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM thresholds WHERE user_id = ?",
      [req.user.id],
    );
    if (rows.length === 0) {
      // Create defaults if not set
      await db.query("INSERT INTO thresholds (user_id) VALUES (?)", [
        req.user.id,
      ]);
      return res.json({
        dry_threshold: 30,
        wet_threshold: 70,
        auto_irrigation: true,
      });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/thresholds — update thresholds
const updateThresholds = async (req, res) => {
  const { dry_threshold, wet_threshold, auto_irrigation } = req.body;

  if (dry_threshold >= wet_threshold) {
    return res
      .status(400)
      .json({ message: "Dry threshold must be less than wet threshold" });
  }

  try {
    await db.query(
      `INSERT INTO thresholds (user_id, dry_threshold, wet_threshold, auto_irrigation)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       dry_threshold = VALUES(dry_threshold),
       wet_threshold = VALUES(wet_threshold),
       auto_irrigation = VALUES(auto_irrigation)`,
      [req.user.id, dry_threshold, wet_threshold, auto_irrigation],
    );
    res.json({ message: "Thresholds updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getThresholds, updateThresholds };
