const express = require("express");
const router = express.Router();
const { createCheckoutSession, confirmStripePayment } = require("../../controllers/shop/stripe-controller");

router.post("/create-checkout-session", createCheckoutSession);
router.post("/confirm", confirmStripePayment);

module.exports = router;
