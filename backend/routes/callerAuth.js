const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Caller = require("../models/Caller");
const auth = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// ===== Helper function to get model by role =====
function getModelByRole(role) {
  switch (role.toUpperCase()) {
    case "ADMIN": return Admin;
    case "CALLER": return Caller;
    case "DEO": return Deo;
    default: return null;
  }
}



router.post("/register", async (req, res) => {
  try {
    const { name, mob_no, email_id, password } = req.body;
    if (!name || !mob_no || !email_id || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ Mobile number validation (must be exactly 10 digits)
    if (!/^\d{10}$/.test(mob_no)) {
      return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
    }

    // ✅ Check existing user
    let existing = await Caller.findOne({ email_id });
    if (existing) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // ✅ Save caller
    const caller = new Caller({ name, mob_no, email_id, password: hashed });
    await caller.save();

    res.status(201).json({
      message: "Caller registered successfully",
      caller_id: caller.caller_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// ✅ Login API (Caller via caller_id)
router.post("/login", async (req, res) => {
  try {
    const { caller_id, password } = req.body;
    if (!caller_id || !password) {
      return res.status(400).json({ message: "Caller ID and password required" });
    }

    // DB se caller find karo by caller_id
    const caller = await Caller.findOne({ caller_id });
    if (!caller) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Password compare karo
    const isMatch = await bcrypt.compare(password, caller.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // JWT payload banayo
    const payload = { 
      id: caller._id, 
      caller_id: caller.caller_id, 
      name: caller.name 
    };

    // JWT token generate karo
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Response bhejo
    res.json({
      success: true,
      message: "Login success",
      token,
      user: { 
        caller_id: caller.caller_id, 
        name: caller.name 
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ===== PROTECTED API =====
router.get("/me", auth, async (req, res) => {
  res.json({ user: req.user }); // decoded data return
});

// ===== VERIFY TOKEN =====
// ===== VERIFY TOKEN + ROLE =====
router.post("/verify", (req, res) => {
  const authHeader = req.headers["authorization"];
  const clientRole = req.headers["x-role"];  // frontend se bhejenge

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

    // ✅ Role match check
    if (decoded.role !== clientRole) {
      return res.status(403).json({ success: false, message: "Role mismatch" });
    }

    // ✅ token + role dono sahi hain
    res.json({ success: true, user: decoded });
  });
});


module.exports = router;
