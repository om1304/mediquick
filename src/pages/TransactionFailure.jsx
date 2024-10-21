import React from "react";
import { Link } from "react-router-dom";
import "./TransactionFailure.css"; // Importing CSS file

const TransactionFailure = () => {
  return (
    <div className="transaction-failure-container">
      <div className="failure-content">
        <h1 className="failure-title">Payment Failed!</h1>
        <p className="failure-message">
          We are sorry, your payment could not be processed at this time. Please
          try again later.
        </p>
        <Link to="/cart">
          <button className="failure-btn retry-btn">Return to Cart</button>
        </Link>
        <Link to="/">
          <button className="failure-btn home-btn">Return to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default TransactionFailure;
