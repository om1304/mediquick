const express = require("express");
const router = express.Router();
const { paymentCheckout } = require("../controllers/paymentController");

router.post("/create-checkout-session", paymentCheckout);

module.exports = router;
