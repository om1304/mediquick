// LoginSignup.jsx
import React, { useState } from "react";
import "./login.css";

const LoginSignup = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [resetemail, setResetEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [contactNumber, setContactNumber] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetFields();
  };

  const toggleForgotPassword = () => {
    setForgotPassword(!forgotPassword);
    resetFields();
  };

  const Alert = ({ message, onClose }) => {
    return (
      <div className="alert" style={{ zIndex: 1001 }}>
        <span>{message}</span>
        <button onClick={onClose} className="close-alert">
          ×
        </button>
      </div>
    );
  };

  const resetFields = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setAddress({ street: "", city: "", postalCode: "", country: "" });
    setContactNumber("");
  };

  const validateLogin = () => {
    if (!email || !password) {
      alert("Please fill in all fields.");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const validateSignup = () => {
    if (
      !username ||
      !email ||
      !password ||
      !contactNumber ||
      !address.street ||
      !address.city ||
      !address.postalCode ||
      !address.country
    ) {
      alert("Please fill in all fields.");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (!validateSignup()) return;
      try {
        const HOST = "http://localhost:5001";
        const response = await fetch(`${HOST}/api/auth/createuser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: username,
            email,
            password,
            contactNumber,
            address,
            role: "user",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.log("Sign up failed");
        } else {
          setAlertMessage(`Account successfully created.`);
          setTimeout(() => setAlertMessage(""), 3000);
          localStorage.setItem("authToken", data.authToken);
          resetFields();
        }
      } catch (error) {
        console.error("Error during sign-up:", error);
      }
    } else {
      if (!validateLogin()) return;
      const HOST = "http://localhost:5001";
      try {
        const url = `${HOST}/api/auth/login`;

        const loginData = {
          email,
          password,
        };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        if (data.authToken) {
          localStorage.setItem("authToken", data.authToken);
          setAlertMessage(`Successfully logged in.`);
          setTimeout(() => setAlertMessage(""), 3000);
        } else {
          setAlertMessage(`Failed to log in`);
          setTimeout(() => setAlertMessage(""), 3000);
        }
      } catch (error) {
        console.log("Could not login", error);
      }
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    const HOST = "http://localhost:5001";
    try {
      const response = await fetch(`${HOST}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetemail }),
      });
      if (response.ok) {
        setAlertMessage("Password reset link sent to your email.");
      } else {
        setAlertMessage("Error sending reset link.");
      }
      //setForgotPassword(false);
      setTimeout(() => setAlertMessage(""), 3000);
    } catch (error) {
      console.error("Error sending forgot password request:", error);
    }
  };

  return (
    <div className="form-container">
      <p className="title">{isSignUp ? "Create an account" : "Welcome back"}</p>
      <form className="form" onSubmit={handleSubmit}>
        {isSignUp && (
          <input
            type="text"
            className="input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {!isSignUp && (
          <p className="forgot-password-link" onClick={toggleForgotPassword}>
            Forgot Password?
          </p>
        )}
        {isSignUp && (
          <>
            <input
              type="text"
              className="input"
              placeholder="Street Address"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
              required
            />
            <input
              type="text"
              className="input"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              required
            />
            <input
              type="text"
              className="input"
              placeholder="Postal Code"
              value={address.postalCode}
              onChange={(e) =>
                setAddress({ ...address, postalCode: e.target.value })
              }
              required
            />
            <input
              type="text"
              className="input"
              placeholder="Country"
              value={address.country}
              onChange={(e) =>
                setAddress({ ...address, country: e.target.value })
              }
              required
            />
            <input
              type="text"
              className="input"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </>
        )}

        {/*Forgot password modal*/}
        {forgotPassword && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="title">Forgot Password</h3>
              <button className="close" onClick={toggleForgotPassword}>
                ×
              </button>
              <form className="form">
                <input
                  type="email"
                  className="input"
                  placeholder="Enter your email"
                  value={resetemail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={handleForgotPasswordSubmit}
                  className="form-btn"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
        <button type="submit" className="form-btn">
          {isSignUp ? "Sign Up" : "Log in"}
        </button>
      </form>
      <p className="sign-up-label">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}
        <span className="sign-up-link" onClick={toggleMode}>
          {isSignUp ? "Log in" : "Sign up"}
        </span>
      </p>

      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage("")} />
      )}
    </div>
  );
};

export default LoginSignup;
