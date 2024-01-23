const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const secretKey = process.env.SECRET_KEY;

// Middleware to validate registration input
const validateRegisterInput = (req, res, next) => {
  const { full_name, email, password } = req.body;
  if (!full_name || !email || !password) {
    return res.status(400).json({
      error:
        "Invalid registration input. Please provide full_name, email, and password.",
    });
  }
  next();
};

// Middleware to validate login input
const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: "Invalid login input. Please provide email and password.",
    });
  }
  next();
};

// Middleware to validate post creation input
const validatePostInput = (req, res, next) => {
  const { title, content, category } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({
      error: "Invalid post input. Please provide title, content, and category.",
    });
  }
  next();
};

// Middleware to validate comment creation input
const validateCommentInput = (req, res, next) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({
      error: "Invalid comment input. Please provide content.",
    });
  }
  next();
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Add your token verification logic here
  // Example: Verify the token and set user information in req.user
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Token not provided." });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    req.user = decoded;
    next();
  });
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validatePostInput,
  validateCommentInput,
  verifyToken,
};
