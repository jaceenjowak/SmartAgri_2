const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { getJwtSecret } = require("../config/jwt");

// Generate JWT
const generateToken = (user) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role || "farmer" },
    getJwtSecret(),
    { expiresIn },
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  const { full_name, email, username, password, address, phone_number } =
    req.body;

  if (
    !full_name ||
    !email ||
    !username ||
    !password ||
    address === undefined ||
    address === null ||
    String(address).trim() === "" ||
    phone_number === undefined ||
    phone_number === null ||
    String(phone_number).trim() === ""
  ) {
    return res.status(400).json({
      message:
        "All fields are required (full name, email, username, password, address, phone number)",
    });
  }

  const addressTrim = String(address).trim();
  const phoneTrim = String(phone_number).trim();

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }
  if (!/\d/.test(password)) {
    return res.status(400).json({
      message: "Password must contain at least one number",
    });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({
      message: "Password must contain at least one uppercase letter",
    });
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return res.status(400).json({
      message: "Password must contain at least one special character",
    });
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

    let newUserId = null;
    const insertAttempts = [
      {
        q: "INSERT INTO users (full_name, email, username, password, address, phone_number, `role`) VALUES (?, ?, ?, ?, ?, ?, ?)",
        a: [full_name, email, username, hashed, addressTrim, phoneTrim, "farmer"],
      },
      {
        q: "INSERT INTO users (full_name, email, username, password, address, phone_number) VALUES (?, ?, ?, ?, ?, ?)",
        a: [full_name, email, username, hashed, addressTrim, phoneTrim],
      },
      {
        q: "INSERT INTO users (full_name, email, username, password) VALUES (?, ?, ?, ?)",
        a: [full_name, email, username, hashed],
      },
    ];
    let insertErr = null;
    for (const step of insertAttempts) {
      try {
        const [r] = await db.query(step.q, step.a);
        newUserId = r.insertId;
        if (newUserId == null) continue;
        break;
      } catch (e) {
        insertErr = e;
        const badField =
          e.code === "ER_BAD_FIELD_ERROR" || e.errno === 1054;
        if (!badField) throw e;
        continue;
      }
    }
    if (newUserId == null) throw insertErr || new Error("User insert failed");

    try {
      await db.query("UPDATE users SET `role` = ? WHERE id = ?", [
        "farmer",
        newUserId,
      ]);
    } catch (_) {
      /* no role column */
    }
    try {
      await db.query(
        "UPDATE users SET address = ?, phone_number = ? WHERE id = ?",
        [addressTrim, phoneTrim, newUserId],
      );
    } catch (_) {
      /* no address/phone on older schema */
    }

    const result = { insertId: newUserId };

    try {
      await db.query(
        `INSERT INTO thresholds (user_id, dry_threshold, wet_threshold, auto_irrigation)
         VALUES (?, 30, 70, 1)`,
        [result.insertId],
      );
    } catch (threshErr) {
      console.warn(
        "Thresholds full row insert failed, retrying user_id only:",
        threshErr.code,
        threshErr.sqlMessage,
      );
      await db.query("INSERT INTO thresholds (user_id) VALUES (?)", [
        result.insertId,
      ]);
    }

    const token = generateToken({
      id: result.insertId,
      username,
      role: "farmer",
    });
    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: result.insertId,
        full_name,
        username,
        email,
        role: "farmer",
        address: addressTrim,
        phone_number: phoneTrim,
      },
    });
  } catch (err) {
    console.error("Register error:", err.code || err.message, err.sqlMessage || "");
    if (err.code === "ER_BAD_FIELD_ERROR") {
      return res.status(500).json({
        message:
          "Database is missing columns for this app version. Restart the server once so it can update the users table, or run backend/migrations/001_add_user_address_phone.sql.",
        details: err.sqlMessage,
      });
    }
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Email or username already exists",
        details: err.sqlMessage,
      });
    }
    if (err.errno === 1364 || err.code === "ER_NO_DEFAULT_FOR_FIELD") {
      return res.status(500).json({
        message:
          "Database users row is missing a default for a required column. Restart the server to apply schema updates, or add missing columns (e.g. role, address, phone_number).",
        details: err.sqlMessage,
      });
    }
    res.status(500).json({
      message: err.message || "Server error during registration",
      details: err.sqlMessage || undefined,
    });
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
        address: user.address ?? "",
        phone_number: user.phone_number ?? "",
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
      "SELECT id, full_name, username, email, role, address, phone_number, created_at FROM users WHERE id = ?",
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
