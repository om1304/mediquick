import React from "react";
import { Link } from "react-router-dom";
import "./TransactionSuccess.css"; // Importing CSS file

const TransactionSuccess = () => {
  return (
    <div className="transaction-success-container">
      <div className="success-content">
        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-message">
          Thank you for your purchase. Your payment was successfully processed.
        </p>
        <Link to="/orders">
          <button className="success-btn view-order-btn">
            View Order Details
          </button>
        </Link>
        <Link to="/">
          <button className="success-btn home-btn">Return to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default TransactionSuccess;
