import React, { useEffect, useContext, useCallback } from "react";
import { CartContext } from "../Cart/CartContext"; // Adjust the import path as needed
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import "./cart.css";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, fetchCartItems } =
    useContext(CartContext);
  const navigate = useNavigate();
  const HOST = "http://localhost:5001";

  // Ensure fetchCartItems is stable in the useEffect dependency array
  const stableFetchCartItems = useCallback(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  useEffect(() => {
    stableFetchCartItems(); // Fetch cart items when the component mounts
  }, [stableFetchCartItems]);

  // Calculate total cart price
  const cartTotal = cartItems
    .reduce((total, item) => {
      const price = item.price || 0; // Assuming price is already a number
      return total + price * item.quantity; // Calculate total considering quantity
    }, 0)
    .toFixed(2);

  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51QCQHxEyGniFItZRCzefK533usakcz4iCib6N8rsT9TiG7bO26u7gJqHbc5dsiofIhSnBURTwhnEKUSKt9NhVLMJ00DjPlTLdl");

    // Ensure cartItems is defined before sending the request
    if (!cartItems || cartItems.length === 0) {
      console.error("Cart is empty. Please add items to your cart.");
      return; // Exit the function if there are no items in the cart
    }

    const body = { cartItems };
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(`${HOST}/api/payment/create-checkout-session`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      // Check if the response is okay
      if (!response.ok) {
        const errorMessage = await response.text(); // Get error message if available
        console.error("Error:", response.status, errorMessage);
        alert("Payment failed: " + errorMessage); // Inform the user about the error
        return; // Exit if there was an error
      }

      const session = await response.json();

      // Ensure session ID is available
      if (!session.id) {
        console.error("No session ID returned. Please try again.");
        alert("No session ID returned. Please try again."); // Inform the user about the error
        return; // Exit if no session ID
      }

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        console.error("Redirect to Checkout Error:", result.error.message);
        alert("Redirect to Checkout Error: " + result.error.message); // Inform the user about the error
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("An unexpected error occurred: " + error.message); // Inform the user about the error
    }
  };

  return (
    <div className="main">
      <div className="breadcrumb">
        <a onClick={() => navigate("/")}>Home</a> &gt; <span>Cart</span>
      </div>

      <div className="cart-container">
        <div className="cart-left">
          <h2>{cartItems.length} Items in your Cart</h2>
          <div className="delivery-section">
            <span>Deliver to:</span>
            <a>Select Pincode</a>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <img src="/path-to-your-empty-cart-image.svg" alt="Empty cart" />
              <p>Your Medicine/Healthcare cart is empty!</p>
            </div>
          ) : (
            <div>
              <ul className="cart-items">
                {cartItems.map((item, index) => (
                  <li key={index} className="cart-item">
                    <img
                      src={item.imageUrl || "/path-to-fallback-image.jpg"} // Fallback image in case imageUrl is not available
                      alt={item.name || "Medicine"}
                    />
                    <div className="item-details">
                      <div className="item-name">{item.name}</div>
                      <div className="item-price">
                        ₹{item.price} × {item.quantity}
                      </div>
                    </div>
                    <button
                      className="remove-button"
                      onClick={() => removeFromCart(item.medicineId)} // Use medicineId
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <button className="clear-cart-button" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          )}
        </div>

        <div className="cart-right">
          <div className="cart-total">
            <span>Cart total: ₹{cartTotal}</span>
            <button onClick={makePayment}>Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
