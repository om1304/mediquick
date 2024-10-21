const stripeSecret = process.env.STRIPE_SECRET;
if (!stripeSecret) {
  console.error("Stripe secret key is not set.");
}
const stripe = require("stripe")(stripeSecret);

exports.paymentCheckout = async (req, res) => {
  try {
    console.log("Incoming Request Body:", req.body); // Log the request body
    const { cartItems } = req.body;

    // Ensure cartItems is provided
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "No items in the cart" });
    }

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd", // Ensure the currency is correct
        product_data: {
          name: item.name,
          images: [item.imageUrl],
        },
        unit_amount: Math.round(item.price * 100), // Convert to smallest currency unit
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/payment-success",
      cancel_url: "http://localhost:3000/payment-failure",
    });

    return res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
