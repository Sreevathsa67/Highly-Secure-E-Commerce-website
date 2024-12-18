const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "Acj4bK_48LTLr4_Ol7BTG8Xud-mIV_jtIGYC0f3sW_vhpXGusnAVvU5QRyIvkkcbrhYjROtlNsnoXISD",
  client_secret: "EGEu34Iy2dv1rqUK-vPMRHiF1H00B6iKF6d45fFznAKb3-CGwIFoQO4g7RDjRGbFC_T5LBfrWVYi-ya9",
});

module.exports = paypal;
