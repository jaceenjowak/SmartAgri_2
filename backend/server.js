const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const mysql = require("mysql2");
const db = require("./routes/db");

const app = express();

app.use(cors());
app.use(express.json());


app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, message: "Server error" });
    }

    if (results.length === 0) {
      return res.json({ success: false, message: "No account found." });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      res.json({
        success: true,
        user: {
          id: user.id,
          fullname: user.first_name + " " + user.last_name
        }
      });
    } else {
      res.json({ success: false, message: "Incorrect password." });
    }
  });
});

app.post("/register", async (req, res) => {
  const {
    first_name,
    middle_name,
    last_name,
    extension_name,
    sex,
    birthdate,
    age,
    email,
    purok,
    barangay,
    city,
    province,
    country,
    zip_code,
    username,
    password
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (
        first_name, middle_name, last_name, extension_name,
        sex, birthdate, age, email,
        purok, barangay, city, province, country, zip_code,
        username, password
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      first_name,
      middle_name,
      last_name,
      extension_name,
      sex,
      birthdate,
      age,
      email,
      purok,
      barangay,
      city,
      province,
      country,
      zip_code,
      username,
      hashedPassword
    ], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json({ message: "Registered successfully!" });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});