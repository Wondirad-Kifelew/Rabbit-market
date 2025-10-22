const express = require("express");
const Product = require("../models/Product");

const { protected, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// get /api/admin/products
// desc get all products
// access private, admin only

router.get("/", protected, adminOnly, async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    }
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
