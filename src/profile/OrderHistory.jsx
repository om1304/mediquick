import React, { useEffect, useState } from "react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No auth token found");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5001/api/orders/getorders",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-md shadow-sm">
      <h3 className="text-xl font-semibold text-gray-700">Order History</h3>
      {orders && orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order._id}
            className="mt-3 p-3 bg-white border border-gray-200 rounded-md shadow-sm"
          >
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Date:</strong> {new Date(order.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Total:</strong> ${order.totalAmount}
            </p>
            <p>
              <strong>Items:</strong>
            </p>
            <ul className="pl-4">
              {order.medicines.map((medicine) => (
                <li key={medicine.medicineId._id}>
                  {medicine.medicineId.name} - {medicine.quantity} pcs
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="mt-3 text-gray-500">No orders found.</p>
      )}
    </div>
  );
};

export default OrderHistory;
