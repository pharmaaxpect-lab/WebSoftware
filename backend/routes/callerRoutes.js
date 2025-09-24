const express = require("express");
const router = express.Router();
const { getCaller, updateCaller, getMyCustomers, getMyProfile, hideCustomer,
  unhideCustomer, getMyunhide, getMyAllCustomers } = require("../controllers/callerController");
const auth = require("../middleware/RoutingAuth");

// ✅ Dynamic Routes for Caller

// Caller apna hi data dekhe (JWT se verify)
router.get("/my-customers", auth, getMyCustomers);

// Caller apna hi data dekhe (JWT se verify) -> caller graph ke liye API 
router.get("/my-all-customer", auth, getMyAllCustomers);

// Caller apna hi data dekhe (JWT se verify)
router.get("/profile", auth, getMyProfile);

// GET all customers of a specific caller
 router.get("/:callerId/customers", getCaller);

// PUT update specific customer of a specific caller
 router.put("/:callerId/customers/:id", updateCaller);

// Hide API
router.put("/customers/:id/hide", auth, hideCustomer);

// Unhide API
router.put("/customers/:id/unhide", auth, unhideCustomer);

// Caller apna hide data dekhe sakta hai (JWT se verify)
router.get("/my-hidden-customers", auth, getMyunhide);

module.exports = router;
