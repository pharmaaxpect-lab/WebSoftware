const express = require("express");
const router = express.Router();
const {
  getUser
} = require("../controllers/adminController");


// GET all customers
router.get("/user", getUser);

module.exports = router;