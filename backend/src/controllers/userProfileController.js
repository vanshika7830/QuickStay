const User = require("../models/User");

// GET current user
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) user.password = req.body.password; // make sure hashed

    const updatedUser = await user.save();
    const { password, ...userData } = updatedUser.toObject();
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};