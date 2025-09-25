const express = require("express");
const router = express.Router();
const { getAdminById } = require("../controllers/AdminpersonalController");

// 🔓 Public route (no token required)
router.get("/public/:id", getAdminById);

module.exports = router;