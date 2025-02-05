import React, { useState } from "react";
import "./Profile.css"

const PersonalDetails = ({ userData }) => {
  // Initialize state with user data
  const [formData, setFormData] = useState({
    name: userData.name || "",
    email: userData.email || "",
    contactNumber: userData.contactNumber || "",
    address: {
      street: userData.address.street || "",
      city: userData.address.city || "",
      postalCode: userData.address.postalCode || "",
      country: userData.address.country || "",
    },
  });
  //the alertMessage state
  const [alertMessage, setAlertMessage] = useState("");

  //handle RESET password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const HOST = "http://localhost:5001";
    try {
      const response = await fetch(`${HOST}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email }),
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
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [name]: value,
        },
      }));
    }
  };

  // Handle form submission for user details
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const HOST = "http://localhost:5001"; // Change this to your actual host
    try {
      const response = await fetch(`${HOST}/api/auth/updateprofile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token, // Adjust this according to your auth mechanism
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setAlertMessage("Profile updated successfully.");
      } else {
        const errorData = await response.json();
        setAlertMessage(
          `Error: ${errorData.message || "Failed to update profile."}`
        );
      }
      setTimeout(() => setAlertMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlertMessage("An error occurred while updating the profile.");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };


  //Alert component
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


  return (
    <>
      <div className="mt-4 bg-gray-50 p-4 rounded-md shadow-sm">
        <h3 className="text-xl font-semibold text-gray-700">
          Personal Details
        </h3>
        <form className="mt-4">
          <div className="space-y-2">
            <label className="block">
              <strong>Name:</strong>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-full p-2 focus:border-green-500 transition duration-200"
                required
              />
            </label>
            <label className="block">
              <strong>Email:</strong>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-full p-2 focus:border-green-500 transition duration-200"
                required
              />
            </label>
            <label className="block">
              <strong>Contact Number:</strong>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-full p-2 focus:border-green-500 transition duration-200"
                required
              />
            </label>
          </div>

          <div className="mt-6">
            {/* Added space here */}
            <h4 className="mt-2 text-lg font-semibold text-gray-600">
              Address
            </h4>
            <label className="block mt-2">
              <strong>Street:</strong>
              <input
                type="text"
                name="street"
                value={formData.address.street}
                onChange={handleChange}
                className="mt-2 block w-full border border-gray-300 rounded-full p-2 focus:border-green-500 transition duration-200"
                required
              />
            </label>
            <label className="block mt-2">
              <strong>City:</strong>
              <input
                type="text"
                name="city"
                value={formData.address.city}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-full p-2 focus:border-green-500 transition duration-200"
                required
              />
            </label>
            <label className="block mt-2">
              <strong>Postal Code:</strong>
              <input
                type="text"
                name="postalCode"
                value={formData.address.postalCode}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-full p-2 focus:border-green-500 transition duration-200"
                required
              />
            </label>
            <label className="block mt-2">
              <strong>Country:</strong>
              <input
                type="text"
                name="country"
                value={formData.address.country}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-full p-2 focus:border-green-500 transition duration-200"
                required
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Save Changes
          </button>
        </form>

        <div className="mt-2">
          <button
            onClick={handleResetPassword}
            className="mt-4 border border-blue-500 bg-white text-blue-500 py-2 px-4 rounded hover:bg-blue-500 hover:text-white"
          >
            Reset Password
          </button>
        </div>
      </div>
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage("")} />
      )}
    </>
  );
};

export default PersonalDetails;
