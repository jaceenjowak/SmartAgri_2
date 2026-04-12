const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  const { full_name, email, username, password } = req.body;

  if (!full_name || !email || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check for existing user
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username],
    );
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "Email or username already exists" });
    }

    const hashed = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      "INSERT INTO users (full_name, email, username, password) VALUES (?, ?, ?, ?)",
      [full_name, email, username, hashed],
    );

    // Create default threshold settings for this user
    await db.query("INSERT INTO thresholds (user_id) VALUES (?)", [
      result.insertId,
    ]);

    const token = generateToken({
      id: result.insertId,
      username,
      role: "farmer",
    });
    res.status(201).json({ message: "Registration successful", token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, full_name, username, email, role, created_at FROM users WHERE id = ?",
      [req.user.id],
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, getMe };
