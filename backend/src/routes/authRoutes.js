const express = require("express");
const router = express.Router();
const { register, login, adminRegister, adminLogin } = require("../controllers/authControllers");

router.post("/register", register);
router.post("/login", login);

// 🔥 New Admin Register Route
router.post("/admin/register", adminRegister);
router.post("/admin/login", adminLogin);

module.exports = router;