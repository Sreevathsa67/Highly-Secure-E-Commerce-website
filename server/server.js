const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config();

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");
const stripeRouter = require("./routes/shop/stripe-routes");
const app = express();
const PORT = process.env.PORT || 5000;

mongoose
  .connect('mongodb+srv://ecommerce:qXLDA5kzFtdI4WDp@ecommerce.gr3e9.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce')
  .then(() => console.log("MongoDB connected"))
  .catch((error) => {
    console.log("MongoDB connection failed:", error);
    process.exit(1);  
  });


  
app.use(
  cors({
    origin: "http://localhost:5173",  
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());



app.use("/api/shop/stripe", stripeRouter);

app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);


app.use((err, req, res, next) => {
  console.error(err.stack);  
  res.status(500).json({ success: false, message: "Internal server error" });
});


app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
