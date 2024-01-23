const express = require("express");
const {
  validateLoginInput,
  validateRegisterInput,
  verifyToken,
} = require("../middleware/middleware");
const {
  registerUser,
  loginUser,
  changePassword,
  deleteUser,
  getAllUsers,
} = require("../controllers/userController.js");
const router = express.Router();

// USER Routes
// Get all users route
router.get("/", verifyToken, getAllUsers)
// Register route
router.post("/register", validateRegisterInput, registerUser);
// Login route
router.post("/login", validateLoginInput, loginUser);
// Change password route
router.put("/:id", verifyToken, changePassword);
// Delete user route
router.delete("/:id", verifyToken, deleteUser);

module.exports = router;
