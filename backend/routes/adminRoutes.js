const express = require("express");
const router = express.Router();
// const jwt = require("jsonwebtoken");
// const Admin = require("../models/Admin");
// const bcrypt = require("bcryptjs");
const {
  getCaller,
  createCaller,
  updateCaller,
  getDeo,
  createDeo,
  updateDeo,
  getUser,
  assignCustomers,
  getDashboard,

} = require("../controllers/adminController");



// POST → http://localhost:2000/api/admin

// const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// GET all Caller
router.get("/", getCaller);

// POST Add Caller
router.post("/", createCaller);

// PUT update Caller
router.put("/:id", updateCaller);

// GET all DEO
router.get("/deo", getDeo);

// POST Add DEO
router.post("/deo", createDeo);

// PUT all DEO
router.put("/deo/:id", updateDeo);

// GET all customers
router.get("/user", getUser);

// PUT update customer
// router.put("/user/:id", updateUser);

// ✅ Assign customers to caller
router.post("/assign", assignCustomers);

// GET /api/admin/dashboard -> caller-wise dashboard data
router.get("/dashboard", getDashboard);

// Admin apna profile fetch kare


module.exports = router;
