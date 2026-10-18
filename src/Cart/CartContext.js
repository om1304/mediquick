// CartContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const getLocalCart = () => {
    try {
      const cart = localStorage.getItem("cart");
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error("Error reading local cart:", error);
      return [];
    }
  };

  const [cartItems, setCartItems] = useState(getLocalCart);
  const [medicineDetails, setMedicineDetails] = useState([]);

  // Deployed Node backend URL
  const HOST = "http://localhost:5001";

  // Helper: Fetch medicine details for guest users using getMedicineById API
  const fetchMedicineDetailsForGuest = async (items) => {
    try {
      if (!items || items.length === 0) {
        setMedicineDetails([]);
        return;
      }

      const detailPromises = items.map(async (item) => {
        const id =
          typeof item.medicineId === "object"
            ? item.medicineId._id
            : item.medicineId;
        const res = await fetch(`${HOST}/api/medicines/${id}`);
        if (res.ok) {
          return await res.json();
        }
        return null;
      });

      const details = await Promise.all(detailPromises);
      setMedicineDetails(details.filter(Boolean));
    } catch (err) {
      console.error("Error fetching guest medicine details:", err);
    }
  };

  // Helper: Save cart to localStorage and update states
  const saveLocalCart = (items) => {
    localStorage.setItem("cart", JSON.stringify(items));
    setCartItems(items);
    fetchMedicineDetailsForGuest(items);
  };

  // Memoized fetch function
  const fetchCartItems = useCallback(async () => {
    try {
      const authToken = localStorage.getItem("auth-token");
      if (!authToken) {
        const localItems = getLocalCart();
        setCartItems(localItems);
        await fetchMedicineDetailsForGuest(localItems);
        return;
      }

      // Logged-in user: fetch from backend (backend populates medicineId)
      const response = await fetch(`${HOST}/api/cart`, {
        headers: {
          "auth-token": authToken,
        },
      });

      const data = await response.json();
      if (response.ok) {
        const backendItems = data.cart.items;

        // Separate pure ID/quantity items from full medicine details
        const pureCartItems = backendItems.map((item) => ({
          medicineId: item.medicineId._id || item.medicineId,
          quantity: item.quantity,
        }));

        const details = backendItems
          .map((item) => item.medicineId)
          .filter(Boolean);

        setCartItems(pureCartItems);
        setMedicineDetails(details);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  }, [HOST]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // ADD TO CART
  const addToCart = async (medicine, quantity = 1) => {
    try {
      const authToken = localStorage.getItem("auth-token");
      const medicineId =
        typeof medicine === "object" ? medicine._id || medicine.id : medicine;

      if (!authToken) {
        const currentCart = getLocalCart();
        const existingIndex = currentCart.findIndex(
          (item) => (item.medicineId?._id || item.medicineId) === medicineId,
        );

        let updatedCart;
        if (existingIndex >= 0) {
          updatedCart = currentCart.map((item, index) =>
            index === existingIndex
              ? { ...item, quantity: item.quantity + Number(quantity) }
              : item,
          );
        } else {
          updatedCart = [
            ...currentCart,
            { medicineId, quantity: Number(quantity) },
          ];
        }

        saveLocalCart(updatedCart);
        return;
      }

      const response = await fetch(`${HOST}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({ medicineId, quantity: Number(quantity) }),
      });

      const data = await response.json();
      if (response.ok) {
        const backendItems = data.cart.items;
        setCartItems(
          backendItems.map((i) => ({
            medicineId: i.medicineId._id || i.medicineId,
            quantity: i.quantity,
          })),
        );
        setMedicineDetails(
          backendItems.map((i) => i.medicineId).filter(Boolean),
        );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // UPDATE CART ITEM QUANTITY
  const updateCart = async (medicineId, quantity) => {
    try {
      if (quantity <= 0) {
        return removeFromCart(medicineId);
      }

      const authToken = localStorage.getItem("auth-token");

      if (!authToken) {
        const currentCart = getLocalCart();
        const updatedCart = currentCart.map((item) =>
          (item.medicineId?._id || item.medicineId) === medicineId
            ? { ...item, quantity: Number(quantity) }
            : item,
        );
        saveLocalCart(updatedCart);
        return;
      }

      const response = await fetch(`${HOST}/api/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({ medicineId, quantity: Number(quantity) }),
      });

      const data = await response.json();
      if (response.ok) {
        const backendItems = data.cart.items;
        setCartItems(
          backendItems.map((i) => ({
            medicineId: i.medicineId._id || i.medicineId,
            quantity: i.quantity,
          })),
        );
        setMedicineDetails(
          backendItems.map((i) => i.medicineId).filter(Boolean),
        );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // REMOVE FROM CART
  const removeFromCart = async (medicineId) => {
    try {
      const authToken = localStorage.getItem("auth-token");

      if (!authToken) {
        const currentCart = getLocalCart();
        const updatedCart = currentCart.filter(
          (item) => (item.medicineId?._id || item.medicineId) !== medicineId,
        );
        saveLocalCart(updatedCart);
        return;
      }

      const response = await fetch(`${HOST}/api/cart/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({ medicineId }),
      });

      const data = await response.json();
      if (response.ok) {
        const backendItems = data.cart.items;
        setCartItems(
          backendItems.map((i) => ({
            medicineId: i.medicineId._id || i.medicineId,
            quantity: i.quantity,
          })),
        );
        setMedicineDetails(
          backendItems.map((i) => i.medicineId).filter(Boolean),
        );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // CLEAR CART
  const clearCart = async () => {
    try {
      const authToken = localStorage.getItem("auth-token");

      if (!authToken) {
        localStorage.removeItem("cart");
        setCartItems([]);
        setMedicineDetails([]);
        return;
      }

      const response = await fetch(`${HOST}/api/cart/clear`, {
        method: "DELETE",
        headers: {
          "auth-token": authToken,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCartItems([]);
        setMedicineDetails([]);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error clearing the cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        medicineDetails,
        addToCart,
        updateCart,
        removeFromCart,
        clearCart,
        fetchCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
