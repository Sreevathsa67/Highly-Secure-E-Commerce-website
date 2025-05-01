const Cart = require("../../models/Cart");
const Product = require("../../models/Product");


const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

  
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    } 
      
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

   
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
    
      cart.items.push({ productId, quantity });
    } else {
      
      cart.items[productIndex].quantity += quantity;
    }

    await cart.save();


    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populatedItems = cart.items.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populatedItems,
      },
    });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding to the cart.",
    });
  }
};


const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is mandatory!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const validItems = cart.items.filter((item) => item.productId);

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populatedItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populatedItems,
      },
    });
  } catch (error) {
    console.error("Error in fetchCartItems:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the cart items.",
    });
  }
};


const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in the cart!",
      });
    }

    cart.items[productIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populatedItems = cart.items.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populatedItems,
      },
    });
  } catch (error) {
    console.error("Error in updateCartItemQty:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the cart item.",
    });
  }
};


const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populatedItems = cart.items.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populatedItems,
      },
    });
  } catch (error) {
    console.error("Error in deleteCartItem:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the cart item.",
    });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItemQty,
  deleteCartItem,
};
