const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Login API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, message: "Login successful" });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// **Admin Signup API (Optional)**
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "❌ User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    res.json({ message: "✅ Admin registered successfully!" });

  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ message: "❌ Server Error" });
  }
});

module.exports = router;
