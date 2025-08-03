const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken, requireRole } = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Contoh route yang hanya bisa diakses admin
router.get("/admin", verifyToken, requireRole("admin"), (req, res) => {
  res.json({ message: "Hello Admin" });
});

// Contoh route yang bisa diakses user
router.get("/user", verifyToken, requireRole("user"), (req, res) => {
  res.json({ message: "Hello User" });
});

module.exports = router;
