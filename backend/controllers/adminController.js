const Caller = require("../models/Caller");
const Deo = require("../models/Deo");
const mongoose = require("mongoose");
const Customer = require("../models/User");
const bcrypt = require("bcryptjs");

// ============ Get Customer -> When ->  Caller_ID = null ========================

const getUser = async (req, res) => {
  try {
    const customers = await Customer.find({ caller_id: null });  // ✅ filter added
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

module.exports = { getUser};