const express = require("express");
const { stripeSaveOrder } = require("../../controllers/shop/order-controller");



const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  capturePayment,
} = require("../../controllers/shop/order-controller");

const router = express.Router();
router.post("/stripe-init-order", initStripeOrder);


router.post("/update-after-stripe", updateStripeOrder);
router.post("/stripe-save-order", stripeSaveOrder);
router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

module.exports = router;
