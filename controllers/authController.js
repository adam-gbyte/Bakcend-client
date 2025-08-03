const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findByUsername(username);
    if (existing) return res.status(400).json({ message: "Username already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const id = await User.createUser(username, hashed);

    res.status(201).json({ message: "User registered", userId: id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  console.log("req.body", req.body);
  const { username, password } = req.body;
  
  try {
    const user = await User.findByUsername(username);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.logout = (req, res) => {
  // Karena tidak menggunakan refresh token, logout dilakukan di sisi client
  res.json({ message: "Logout by removing token on client-side" });
};
