const express = require("express");
const Product = require("../models/Product");
const { protected, adminOnly } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const router = express.Router();
// @route POST /api/products
// description: create a new product
// access: private/admin

router.post("/", protected, adminOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id, //reference to the admin user who created it
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT /api/products/:id
// description update an existing product ID
// private/admin

router.put("/:id", protected, adminOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;
    // find the product using the id in the url

    const products = await Product.findById(req.params.id);
    if (products) {
      products.name = name || products.name;
      products.description = description || products.description;
      products.price = price || products.price;
      products.discountPrice = discountPrice || products.discountPrice;
      products.countInStock = countInStock || products.countInStock;
      products.sku = sku || products.sku;
      products.category = category || products.category;
      products.brand = brand || products.brand;
      products.sizes = sizes || products.sizes;
      products.colors = colors || products.colors;
      products.collections = collections || products.collections;
      products.material = material || products.material;
      products.gender = gender || products.gender;
      products.images = images || products.images;
      products.isFeatured = isFeatured ?? products.isFeatured;
      products.isPublished = isPublished ?? products.isPublished;
      products.tags = tags || products.tags;
      products.dimensions = dimensions || products.dimensions;
      products.weight = weight || products.weight;
      products.sku = weight || products.sku;
      // Save updated product to db
      const updatedProduct = await products.save();
      res.json(updatedProduct);
    } else {
      res.status(400).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
// delete prod from DB using DELETE /api/products/:id
// access private/admin

router.delete("/:id", protected, adminOnly, async (req, res) => {
  try {
    // find the product using the id

    const IsProductInDB = await Product.findById(req.params.id);
    if (IsProductInDB) {
      await Product.deleteOne();
      res.send("Deleted successfully");
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// get api/products
// get all products with optional query filters
// access public

router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    // Filter logic
    let query = {};
    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collections = collection;
    }

    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category;
    }

    if (material) {
      query.material = { $in: material.split(",") }; //we want {$in: ['cotton', 'silk']} from 'cotton,silk'
    }
    if (brand) {
      query.brand = { $in: brand.split(",") };
    }
    if (size) {
      query.sizes = { $in: size.split(",") };
    }

    if (color) {
      query.colors = { $in: [color] };
    }
    if (gender) {
      query.gender = gender;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sort Logic
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }
    // Fetch products and apply sorting and limit
    let products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});
// get /api/products/best-seller
// desc retrive product with highest rating
// access public

router.get("/best-seller", async (req, res) => {
  try {
    // create an array of objects containing product id along with their ratings
    const bestSeller = await Product.find().sort({ rating: -1 }).limit(1);
    if (bestSeller) {
      res.json(bestSeller);
    } else {
      res.status(404).json({ message: "No best seller found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get /api/products/new-arrivals
// description latest 8 products based on creation date
// access public
router.get("/new-arrivals", async (req, res) => {
  try {
    const newProducts = await Product.find().sort({ createdAt: -1 }).limit(8);
    if (newProducts) {
      res.json(newProducts);
    } else {
      res.status(404).json({ message: "No new products" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
// GET /api/products/:id
// get a single product with its id

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// get /api/products/similar/:id
// description get similar products based on current produts gender and category
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // find the product to get the gender and category of it
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
    }
    // filter by gender and category of product with this id
    const similarProducts = await Product.find({
      _id: { $ne: id },
      category: product.category,
      gender: product.gender,
    }).limit(4);
    res.json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
