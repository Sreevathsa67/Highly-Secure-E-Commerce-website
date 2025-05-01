const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


exports.createCheckoutSession = async (req, res) => {
  try {
    const { orderId, cartItems } = req.body;

    
    const line_items = cartItems?.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.title },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })) || [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Test Product" },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `http://localhost:5173/stripe-success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
      cancel_url: "http://localhost:5173/shop/checkout",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(" Stripe session error:", err);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
};


exports.confirmStripePayment = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.body.sessionId);

    if (session.payment_status === "paid") {
      
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: "Payment not successful" });
    }
  } catch (err) {
    console.error(" Stripe payment confirmation failed:", err);
    res.status(500).json({ error: "Stripe payment confirmation failed" });
  }
};
