const express = require("express");
const router = express.Router();
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require("../controllers/customerController");



// GET all customers
router.get("/", getCustomers);

// GET single customer
router.get("/:id", getCustomerById);

// POST new customer
router.post("/", createCustomer);

// PUT update customer
router.put("/:id", updateCustomer);

// DELETE customer
router.delete("/:id", deleteCustomer);


module.exports = router;
