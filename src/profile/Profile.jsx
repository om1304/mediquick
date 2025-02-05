import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import PersonalDetails from "./PersonalDetails"; // Import the new component
import OrderHistory from "./OrderHistory"; // Import the new component

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personalDetails"); // Track active tab
  const navigate = useNavigate();

  const handleLogoutClick = (e) => {
    e.preventDefault();
    localStorage.setItem("authToken", "");
    navigate("/");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No auth token found");
        navigate("/login"); // Redirects to login if no token is found
        return;
      }

      try {
        const response = await fetch("http://localhost:5001/api/auth/getuser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!userData)
    return <p className="text-center text-red-500">User data not found</p>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 h-screen bg-white text-black p-6">
        <h2 className="text-2xl text-green-600 font-semibold mb-6">
          My Account
        </h2>
        <ul className="space-y-4">
          <li>
            <button
              className="w-full text-left hover:text-green-500"
              onClick={() => setActiveTab("orderHistory")}
            >
              Orders
            </button>
          </li>
          <li>
            <button
              className="w-full text-left hover:text-green-500"
              onClick={() => setActiveTab("personalDetails")}
            >
              Personal details
            </button>
          </li>
          <li>
            <button
              className="w-full text-left text-red-400 hover:text-red-700"
              onClick={handleLogoutClick}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Profile Content */}
      <div className="w-3/4 p-6">
        <div className="breadcrumb mb-4">
          <span id="home" onClick={() => navigate("/")}>
            Home
          </span>{" "}
          &gt; <span>Profile</span>
        </div>

        <div className="max-w-2xl p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>

          {activeTab === "personalDetails" && (
            <PersonalDetails userData={userData} />
          )}
          {activeTab === "orderHistory" && (
            <OrderHistory orders={userData.orders} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
