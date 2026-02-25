const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const User = require("../models/User");

router.get("/dashboard", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("name email role createdAt"); 
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;