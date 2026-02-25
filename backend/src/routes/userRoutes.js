const express = require("express");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// ================= GET ALL USERS (ADMIN) =================
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.log("FETCH USERS ERROR:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;