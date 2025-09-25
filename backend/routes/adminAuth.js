const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");   // ✅ Admin model import
const auth = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// ================= ADMIN REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, mob_no, email_id, password } = req.body;

    if (!name || !mob_no || !email_id || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if already exists
    const existing = await Admin.findOne({ email_id });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists with this email" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      name,
      mob_no,
      email_id,
      password: hashedPassword
      // ✅ admin_id auto-generate hoga (pre-save hook se)
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin registered successfully",
      admin_id: newAdmin.admin_id   // ✅ return auto-generated ID
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ================= ADMIN LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email_id, password } = req.body;

    if (!email_id || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await Admin.findOne({ email_id });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: "ADMIN" },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: "Admin login successful",
      token,
      admin: {
        admin_id: user.admin_id,
        name: user.name,
        mob_no: user.mob_no,
        email_id: user.email_id
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===== PROTECTED API =====
router.get("/me", auth, async (req, res) => {
  res.json({ user: req.user }); // decoded token data
});

// ===== VERIFY TOKEN =====
// ===== VERIFY TOKEN + ROLE =====
// ===== VERIFY TOKEN + ROLE (ADMIN only) =====
router.post("/verify", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Token expired" });
      }
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    // ✅ Only ADMIN allowed
    if (decoded.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. ADMIN role required",
      });
    }

    // ✅ Agar sab sahi hai
    res.json({
      success: true,
      message: "Token verified. Role = ADMIN",
      user: decoded,
    });
  });
});

module.exports = router;
