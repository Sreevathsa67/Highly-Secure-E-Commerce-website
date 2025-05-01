const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");


const addProductReview = async (req, res) => {
  try {
    const { productId, reviewMessage, reviewValue } = req.body;
    const userId = req.user.id; 
    const userName = req.user.name; 

    
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: { $in: ["confirmed", "delivered"] }, 
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase the product before reviewing it.",
      });
    }

    
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

    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();

    
    const reviews = await ProductReview.find({ productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

   
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
  
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    
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
