const mysql = require("mysql2/promise");
require("dotenv").config();

// Create a connection pool for efficient DB access
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/** Add users.address / users.phone_number if an older DB never ran the migration. */
async function ensureUserSchema() {
  const dbName = process.env.DB_NAME;
  if (!dbName) return;

  const hasColumn = async (columnName) => {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS c FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND LOWER(TABLE_NAME) = 'users' AND COLUMN_NAME = ?`,
      [String(dbName).trim(), columnName],
    );
    return Number(rows[0].c) > 0;
  };

  if (!(await hasColumn("address"))) {
    await pool.query(
      "ALTER TABLE users ADD COLUMN address VARCHAR(500) NOT NULL DEFAULT ''",
    );
    console.log("✅ DB: added users.address");
  }
  if (!(await hasColumn("phone_number"))) {
    await pool.query(
      "ALTER TABLE users ADD COLUMN phone_number VARCHAR(32) NOT NULL DEFAULT ''",
    );
    console.log("✅ DB: added users.phone_number");
  }
  if (!(await hasColumn("role"))) {
    await pool.query(
      "ALTER TABLE users ADD COLUMN `role` VARCHAR(32) NOT NULL DEFAULT 'farmer'",
    );
    console.log("✅ DB: added users.role");
  }
}

pool.ensureUserSchema = ensureUserSchema;

// Test connection on startup
pool
  .getConnection()
  .then((conn) => {
    console.log("✅ MySQL connected successfully");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  });

module.exports = pool;
