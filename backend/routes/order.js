const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const fetchUser = require("../middleware/fetchUser");

// Route to get order history for the logged-in user
router.get("/getorders", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find orders associated with the logged-in user
    const orders = await Order.find({ userId }).populate(
      "medicines.medicineId"
    );

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
