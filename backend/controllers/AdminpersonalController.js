const Admin = require("../models/Admin");
const mongoose = require("mongoose");

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params; // e.g., "ADM001"
    const admin = await Admin.findOne({ admin_id: id }).select("-password");

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.json({ success: true, admin });
  } catch (err) {
    console.error("❌ Error fetching admin:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getAdminById };