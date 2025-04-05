const express = require("express");
const { getSalesData } = require("../controllers/salesController");

const router = express.Router();
router.get("/sales-data", getSalesData);

module.exports = router;
