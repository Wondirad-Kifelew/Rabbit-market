const express = require("express");
const User = require("../models/User");
const { protected, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// get /api/admin/users
// desc get all users(admin only)
// access private and admin

router.get("/", protected, adminOnly, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// post /api/admin/users
// add a new user
// access private/admin
router.post("/", protected, adminOnly, async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ message: `user with email--> ${email} already exists` });
    }
    user = new User({
      name,
      email,
      password,
      role: role,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
// Put /api/admin/users/:id
// desc update user information-(admin only) Name, email and role
// access Admin(protected)

router.put("/:id", protected, adminOnly, async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    if (user) {
      (user.name = name || user.name),
        (user.email = email || user.email),
        (user.role = role || user.role);
    }

    const updatedUser = await user.save();
    res.status(201).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Delete /api/admin/users/:id
// desc delete user
// private(admin only)

router.delete("/:id", protected, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
