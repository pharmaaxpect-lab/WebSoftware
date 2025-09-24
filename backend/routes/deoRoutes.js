const express = require("express");
const { getDeo } = require("../controllers/deoController");

const router = express.Router();

router.get("/deo/:deo_id", getDeo);

module.exports = router;