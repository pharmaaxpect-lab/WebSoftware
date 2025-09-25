const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Deo = require("../models/Deo");
const auth = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h"; // ⏳ Token expire time

// ===== Helper function to get model by role =====
function getModelByRole(role) {
  switch (role.toUpperCase()) {
    case "ADMIN":
      return Admin;
    case "CALLER":
      return Caller;
    case "DEO":
      return Deo;
    default:
      return null;
  }
}
// ✅ Registration API
router.post("/register", async (req, res) => {
  try {
    const { name, mob_no, email_id, password } = req.body;
    if (!name || !mob_no || !email_id || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // check existing
    let existing = await Deo.findOne({ email_id });
    if (existing) {
      return res
        .status(409)
        .json({ message: "User already exists with this email" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const deo = new Deo({ name, mob_no, email_id, password: hashed });
    await deo.save();

    res
      .status(201)
      .json({ message: "DEO registered successfully", deo_id: deo.deo_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Login API
router.post("/login", async (req, res) => {
  try {
    const { email_id, password } = req.body;
    if (!email_id || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const deo = await Deo.findOne({ email_id });
    if (!deo) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, deo.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: deo._id, deo_id: deo.deo_id, email: deo.email_id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      message: "Login success",
      token,
      user: { deo_id: deo.deo_id, name: deo.name, email_id: deo.email_id },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== PROTECTED API =====
router.get("/me", auth, async (req, res) => {
  res.json({ user: req.user }); // decoded data return
});


// ===== VERIFY TOKEN + ROLE + DEO_ID =====
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
