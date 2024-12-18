const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1, // Default quantity for a product in the cart
        },
        addedAt: {
          type: Date,
          default: Date.now, // Track when the product was added to the cart
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

// Pre-save hook to ensure no duplicate products are added
CartSchema.pre("save", async function (next) {
  const cart = this;
  if (cart.isModified("items")) {
    // Ensure unique product IDs in the cart
    const uniqueItems = [];
    const seenProductIds = new Set();

    for (const item of cart.items) {
      const productIdStr = item.productId.toString();
      if (!seenProductIds.has(productIdStr)) {
        uniqueItems.push(item);
        seenProductIds.add(productIdStr);
      }
    }

    cart.items = uniqueItems;
  }
  next();
});

module.exports = mongoose.model("Cart", CartSchema);
