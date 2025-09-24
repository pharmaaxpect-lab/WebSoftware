const Customer = require("../models/User");
const Caller = require("../models/Caller");


// ✅ Caller apna personal data dekhe (JWT se caller_id aayega)
const getMyProfile = async (req, res) => {
  try {
    const callerId = req.user.caller_id; // from JWT (string like CLR009)

    // 🔑 caller_id field से search करो
    const caller = await Caller.findOne({ caller_id: callerId }).select("-password");

    if (!caller) {
      return res.status(404).json({ success: false, message: "Caller not found" });
    }

    res.json({ success: true, caller });
  } catch (err) {
    console.error("❌ Error in getMyProfile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get customers by callerId (dynamic route)
const getCaller = async (req, res) => {
  try {
    const { callerId } = req.params;
    const customers = await Customer.find({ caller_id: callerId });
    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch customers" });
  }
};

// ✅ Caller apna hi data dekhe (JWT se caller_id aayega)
const getMyCustomers = async (req, res) => {
  try {
    const callerId = req.user.caller_id; // from JWT
    const customers = await Customer.find({ caller_id: callerId, hidden: false});
    res.json({ success: true, customers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// this controller use for caller dashboard
const getMyAllCustomers = async (req, res) => {
  try {
    const callerId = req.user.caller_id; // from JWT
    const customers = await Customer.find({ caller_id: callerId});
    res.json({ success: true, customers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const getMyunhide = async (req, res) => {
  try {
    const callerId = req.user.caller_id; // from JWT
    const customers = await Customer.find({ caller_id: callerId, hidden: true});
    res.json({ success: true, customers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Update customer (only specific caller ka hi customer update ho)
const updateCaller = async (req, res) => {
  try {
    const { id, callerId } = req.params;

    // ensure this caller is updating only his customers
    const customer = await Customer.findOneAndUpdate(
      { _id: id, caller_id: callerId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) return res.status(404).json({ success: false, message: "Customer not found or not yours" });

    res.json({ success: true, message: "Customer updated successfully!", data: customer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// Hide customer
const hideCustomer = async (req, res) => {
  try {
    const callerId = req.user.caller_id; // JWT से caller id
    const customerId = req.params.id;

    // सिर्फ उसी caller का customer update होना चाहिए
    const updated = await Customer.findOneAndUpdate(
      { _id: customerId, caller_id: callerId }, 
      { $set: { hidden: true } }, 
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Customer not found or not yours" });
    }

    res.json({ success: true, message: "Customer hidden", customer: updated });
  } catch (err) {
    console.error("❌ Hide error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 👉 UNHIDE customer
const unhideCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const callerId = req.user.caller_id; // JWT middleware से आया

    const customer = await Customer.findOneAndUpdate(
      { _id: id, caller_id: callerId },
      { hidden: false },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found or unauthorized" });
    }

    res.json({ success: true, message: "Customer unhidden successfully", customer });
  } catch (err) {
    console.error("❌ Error in unhideCustomer:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getCaller, getMyCustomers, updateCaller, getMyProfile, hideCustomer, unhideCustomer, getMyunhide, getMyAllCustomers};
