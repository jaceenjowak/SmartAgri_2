const db = require('../config/db');

// GET /api/notifications — get all for current user
const getNotifications = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/notifications/:id/read
const markRead = async (req, res) => {
  try {
    await db.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/notifications/read-all
const markAllRead = async (req, res) => {
  try {
    await db.query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
      [req.user.id]
    );
    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/notifications/unread-count
const getUnreadCount = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [req.user.id]
    );
    res.json({ count: rows[0].count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getNotifications, markRead, markAllRead, getUnreadCount };