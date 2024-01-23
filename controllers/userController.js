const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db.js");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = generateUsername(full_name);
    function generateUsername(full_name) {
      const parts = full_name.split(" ");
      const firstName = parts[0].toLowerCase();
      const randomNumber = Math.floor(Math.random() * 1000);
      return `${firstName}${randomNumber}`;
    }
    const result = await pool.query(
      "INSERT INTO users (full_name, email, password, username) VALUES ($1, $2, $3, $4) RETURNING *",
      [full_name, email, hashedPassword, username]
    );

    const user = result.rows[0];
    res.json({
      userId: user.id,
      username: user.username,
      full_name: user.full_name,
      email: user.email,
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error("Error logging in user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const changePassword = asyncHandler(async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.userId;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      userId,
    ]);

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;

    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    await pool.query("DELETE FROM posts WHERE user_id = $1", [userId]);
    await pool.query("DELETE FROM comments WHERE user_id = $1", [userId]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  changePassword,
  deleteUser,
};
