import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Reset.css"; // Ensure the CSS file is imported

const ResetPasswordModal = ({ onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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

  // Function to extract the token from the URL
  const getTokenFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get("token"); // Get the 'token' parameter from the URL
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const token = getTokenFromUrl(); // Fetch the token directly
    const HOST = "http://localhost:5001"; // Update this with your backend URL
    try {
      const response = await fetch(`${HOST}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (response.ok) {
        //alert("Password has been reset successfully.");
        setAlertMessage(`Password has been reset successfully.`);
        setTimeout(() => setAlertMessage(""), 3000);
        navigate("/"); // Navigate to home page
      } else {
        const data = await response.json();
        alert(data.error || "Error resetting password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="title">Reset Password</h3>
        <form onSubmit={handleResetPasswordSubmit} className="form">
          <input
            type={showPassword ? "text" : "password"}
            className="input"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type={showPassword ? "text" : "password"}
            className="input"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="show-password">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label>Show Password</label>
          </div>
          <button type="submit" className="form-btn">
            Reset Password
          </button>
        </form>
      </div>
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage("")} />
      )}
    </div>
  );
};

export default ResetPasswordModal;
