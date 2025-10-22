const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const products = require("./data/products");

dotenv.config();

// connect to the database
mongoose.connect(process.env.MONGODB_URI);

const seedData = async () => {
  try {
    // clear db everytime

    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();

    // add a default admin user to every product
    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password",
      role: "admin",
    });

    // assign the user id to each product
    const userId = createdUser._id;
    const updatedProducts = products.map((product, i) => {
      return { ...product, user: userId };
    });

    // insert to the db
    await Product.insertMany(updatedProducts);
    console.log("Product Data Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error("Error seeding the data", error.message);
    process.exit(1);
  }
};

seedData();
