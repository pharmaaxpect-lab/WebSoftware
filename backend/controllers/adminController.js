
const Caller = require("../models/Caller");
const Deo = require("../models/Deo");
const mongoose = require("mongoose");
const Customer = require("../models/User");





// ================== Get All Caller =======================

const getCaller = async (req, res) => {
  try {
    const caller = await Caller.find();
    res.json(caller);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

// ================  Add New Caller =============================

const createCaller = async (req, res) => {
  try {
    const { caller_id, name, mob_no, email_id, password } = req.body;

    if (!caller_id || !name || !mob_no || !email_id || !password) {
  return res.status(400).json({ message: "All fields are required!" });
}

    const newCaller = new Caller({
  caller_id,
  name,
  mob_no,
  email_id,
  password
});

    await newCaller.save();

    res.status(201).json({ message: "Caller added successfully!", data: newCaller });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ============== Update Caller ===================================

const updateCaller = async (req, res) => {
  try {
    // Remove _id if it's in request body
    const { _id, ...updateData } = req.body;

    const caller = await Caller.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!caller) return res.status(404).json({ message: "Caller not found" });

    res.json({ message: "Caller updated successfully!", data: caller });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================== Get All DEO =======================

const getDeo = async (req, res) => {
  try {
    const deo = await Deo.find();
    res.json(deo);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

// ============= Add DEO =====================

const createDeo = async (req, res) => {
  try {
    const { deo_id, name, mob_no, email_id, password } = req.body;

    if (!deo_id || !name || !mob_no || !email_id || !password) {
  return res.status(400).json({ message: "All fields are required!" });
}

    const newDeo = new Deo({
  deo_id,
  name,
  mob_no,
  email_id,
  password
});

    await newDeo.save();

    res.status(201).json({ message: "Deo added successfully!", data: newDeo });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ============== Update DEO ===================================

const updateDeo = async (req, res) => {
  try {
    // Remove _id if it's in request body
    const { _id, ...updateData } = req.body;

    const deo = await Deo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!deo) return res.status(404).json({ message: "DEO not found" });

    res.json({ message: "DEO updated successfully!", data: deo });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ============ Get Customer -> When ->  Caller_ID = null ========================

const getUser = async (req, res) => {
  try {
    const customers = await Customer.find({ caller_id: null });  // ✅ filter added
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

// ================= Update Customer ========================

//Update customer
/*const updateUser = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer updated successfully!", data: customer });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};*/

const assignCustomers = async (req, res) => {
  try {
    const { caller_id, customerIds } = req.body;

    if (!caller_id || !Array.isArray(customerIds) || customerIds.length === 0) {
      return res.status(400).json({
        message: "Caller ID and customer IDs are required"
      });
    }

    // Ensure all IDs are valid ObjectId
    const ids = customerIds.map(id => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid customer ID: ${id}`);
      }
      return new mongoose.Types.ObjectId(id);
    });

    const result = await Customer.updateMany(
      { _id: { $in: ids } },
      { $set: { caller_id } }
    );

    return res.json({
      message: "Customers assigned successfully!",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error("❌ Error assigning customers:", err);
    return res.status(500).json({
      message: "Server error while assigning customers",
      error: err.message
    });
  }
};

const getDashboard = async (req, res) => {
  try {
    // Aggregate callers + their leads from `customers` collection
    const callers = await Caller.aggregate([
      {
        $lookup: {
          from: 'customers',            // collection name (lowercase, plural)
          localField: 'caller_id',
          foreignField: 'caller_id',
          as: 'leads'
        }
      },
      {
        $project: {
          caller_id: 1,
          name: 1,
          leads: 1
        }
      }
    ]);

    // totalLeads (sum of all caller leads)
    const totalLeads = callers.reduce((acc, c) => acc + (c.leads ? c.leads.length : 0), 0);

    res.json({
      totalLeads,
      callers
    });
  } catch (err) {
    console.error('Error building dashboard:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};


module.exports = { createCaller, getCaller, updateCaller, getDeo, createDeo, updateDeo, getUser, assignCustomers, getDashboard };
