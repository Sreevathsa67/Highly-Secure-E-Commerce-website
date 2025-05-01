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
          default: 1,
        },
        addedAt: {
          type: Date,
          default: Date.now, 
        },
      },
    ],
  },
  {
    timestamps: true, 
  }
);


CartSchema.pre("save", async function (next) {
  const cart = this;
  if (cart.isModified("items")) {
    
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
