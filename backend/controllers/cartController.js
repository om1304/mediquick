// controllers/cartController.js
const User = require("../models/User");
const Medicine = require("../models/Medicine");

// GET: get cart items with populated medicine details
exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("cart.items.medicineId");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.json({ cart: user.cart });
  } catch (error) {
    console.error("Error fetching cart items:", error.message);
    return res.status(500).send("Internal Server Error");
  }
};

// POST: add item to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { medicineId, quantity = 1 } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify medicine exists in catalog
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }

    const itemIndex = user.cart.items.findIndex(
      (item) => item.medicineId.toString() === medicineId,
    );

    if (itemIndex >= 0) {
      // Already in cart -> increase quantity
      user.cart.items[itemIndex].quantity += Number(quantity);
    } else {
      // New item -> store only ID and quantity
      user.cart.items.push({
        medicineId,
        quantity: Number(quantity),
      });
    }

    await user.save();

    // Populate before sending back to frontend
    await user.populate("cart.items.medicineId");

    return res.json({ message: "Item added to cart", cart: user.cart });
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    return res.status(500).send("Internal Server Error");
  }
};

// PUT: update cart item quantity
exports.updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { medicineId, quantity } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const itemIndex = user.cart.items.findIndex(
      (item) => item.medicineId.toString() === medicineId,
    );
    if (itemIndex < 0) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    if (quantity <= 0) {
      user.cart.items.splice(itemIndex, 1);
    } else {
      user.cart.items[itemIndex].quantity = Number(quantity);
    }

    await user.save();
    await user.populate("cart.items.medicineId");

    return res.json({ message: "Cart updated", cart: user.cart });
  } catch (error) {
    console.error("Error updating cart:", error.message);
    return res.status(500).send("Internal Server Error");
  }
};

// DELETE: remove single item from cart
exports.deleteFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { medicineId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const itemIndex = user.cart.items.findIndex(
      (item) => item.medicineId.toString() === medicineId,
    );
    if (itemIndex < 0) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    user.cart.items.splice(itemIndex, 1);

    await user.save();
    await user.populate("cart.items.medicineId");

    return res.json({ message: "Item removed from cart", cart: user.cart });
  } catch (error) {
    console.error("Error deleting item from cart:", error.message);
    return res.status(500).send("Internal Server Error");
  }
};

// DELETE: clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.cart.items = [];

    await user.save();
    return res.json({ message: "Cart cleared successfully", cart: user.cart });
  } catch (error) {
    console.error("Error clearing cart:", error.message);
    return res.status(500).send("Internal Server Error");
  }
};
