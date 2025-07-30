const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} = require("../controllers/adminController");

const authenticate = require("../middleware/authenticate");
const authorizeRole = require("../middleware/authorizeRole");

// Admin routes - require admin role
router.use(authenticate, authorizeRole);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
