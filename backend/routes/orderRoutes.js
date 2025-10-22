const express = require("express");
const Order = require("../models/Order");
const { protected } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/orders/my-orders
// desc get loggedin user's orders
// access private

router.get("/my-orders", protected, async (req, res) => {
  try {
    // find the orders for the authenticated user
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    }); //sort by most recent orders
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// get /api/orders/:id
// desc get order details by id
// access private

router.get("/:id", protected, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Return the full order details
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
