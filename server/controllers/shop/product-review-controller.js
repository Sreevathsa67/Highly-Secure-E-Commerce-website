const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

// Add Product Review
const addProductReview = async (req, res) => {
  try {
    const { productId, reviewMessage, reviewValue } = req.body;
    const userId = req.user.id; // Assuming the user is authenticated and userId is stored in the JWT payload
    const userName = req.user.name; // Assuming userName is also stored in the JWT payload

    // Check if the user has purchased the product
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: { $in: ["confirmed", "delivered"] }, // Match confirmed or delivered orders
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase the product before reviewing it.",
      });
    }

    // Check if the user has already reviewed this product
    const existingReview = await ProductReview.findOne({
      productId,
      userId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    // Create a new review
    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();

    // Calculate the new average review for the product
    const reviews = await ProductReview.find({ productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

    // Update the average review for the product
    await Product.findByIdAndUpdate(productId, { averageReview });

    res.status(201).json({
      success: true,
      message: "Review added successfully!",
      data: newReview,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the review.",
    });
  }
};

// Get Product Reviews
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Fetch all reviews for the product
    const reviews = await ProductReview.find({ productId });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching reviews.",
    });
  }
};

module.exports = { addProductReview, getProductReviews };
