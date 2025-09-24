const Deo = require("../models/Deo");
const Caller = require("../models/Caller");
const Admin = require("../models/Admin");

// ✅ Get DEO by deo_id
const getDeo = async (req, res) => {
  try {
    const { deo_id } = req.params;
    const deo = await Deo.find({ deo_id: deo_id }); 
    res.json(deo);
  } catch (err) {
    console.error("Error fetching DEO:", err);
    res.status(500).json({ error: "Failed to fetch DEO" });
  }
};

// ✅ Get Caller by caller_id
const getCaller = async (req, res) => {
  try {
    const { caller_id } = req.params;
    const caller = await Caller.find({ caller_id: caller_id }); 
    res.json(caller);
  } catch (err) {
    console.error("Error fetching Caller:", err);
    res.status(500).json({ error: "Failed to fetch Caller" });
  }
};

// ✅ Get Admin by admin_id
const getAdmin = async (req, res) => {
  try {
    const { admin_id } = req.params;
    const admin = await Admin.find({ admin_id: admin_id }); 
    res.json(admin);
  } catch (err) {
    console.error("Error fetching Admin:", err);
    res.status(500).json({ error: "Failed to fetch Admin" });
  }
};

module.exports = { getDeo, getCaller, getAdmin };