const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "your id",
  client_secret: "your secet key",
});

module.exports = paypal;
