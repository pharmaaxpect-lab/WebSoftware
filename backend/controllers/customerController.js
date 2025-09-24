const Customer = require("../models/User");


const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};


// Get single customer
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const createCustomer = async (req, res) => {
  try {
    const {
      admin_id,
      deo_id,
      caller_id,
      name,
      mob_no,
      email_id,
      state,
      address,
      query_date,
      lead_status,
      comment,
      alert_time,
      final_confirm
    } = req.body;

    // Required fields check
    if (!name || !mob_no || !email_id) {
      return res.status(400).json({
        message: "Name, Mobile and Email are required!"
      });
    }

    // अगर कोई field frontend से नहीं मिली तो null assign कर दो
    const newCustomer = await Customer.create({
      admin_id: admin_id || null,
      deo_id: deo_id || null,
      caller_id: caller_id || null,
      name: name || null,
      mob_no: mob_no || null,
      email_id: email_id || null,
      state: state || null,
      address: address || null,
      query_date: query_date || null,
      lead_status: lead_status || null,
      comment: comment || null,
      alert_time: alert_time || null,
      final_confirm: final_confirm ?? null // boolean case handle
    });

    return res.status(201).json({
      message: "Customer added successfully!",
      data: newCustomer
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message || "Something went wrong"
    });
  }
};

// module.exports = { createCustomer };

// Update customer
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer updated successfully!", data: customer });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Delete customer
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer };
