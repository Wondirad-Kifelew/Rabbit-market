const express = require("express");
const Order = require("../models/Order");
const { protected, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/admin/orders
// get all orders
// private and admin

router.get("/", protected, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// put /api/admin/orders/:id
// desc update order status
// access private and admin

router.put("/:id", protected, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = req.body.status || order.status;
    order.isDelivered = order.status === "Delivered" ? true : false;
    order.deliveredAt =
      req.body.status === "Delivered" ? Date.now() : order.deliveredAt; //gotta check this

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// delete /api/admin/orders/:id
// desc delete on order
// access private and admin
router.delete("/:id", protected, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
