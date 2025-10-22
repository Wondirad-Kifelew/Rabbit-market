const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { protected } = require("../middleware/authMiddleware");

// @route POST /api/route/register
// @desc Register a new user
// @access public

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("In handler", name, email, password);
  try {
    // reg logic
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists!" });

    user = new User({ name, email, password });
    await user.save();

    //  create jwt paylload

    const payload = { user: { id: user._id, role: user.role } };
    // sign and return token along with data
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true, //true in production
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route post /api/users/login
// @desc Authenticate user
// @access public

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user is registered before
    let user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // if username and password is correct send token to the frontend
    //  create jwt paylload
    const payload = { user: { id: user._id, role: user.role } };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });
    // Send user info but token through a cookie
    res
      .cookie("token", token, {
        httpOnly: true, //prevents js access to the cookie
        secure: true, //cookie sent over https not http
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/users/profile
// @desc get logged in users profile (protected route)

router.get("/profile", protected, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
// @route POST /api/users/logout
// @desc logout usersand clear cookie (protected route)
router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "None", secure: true });
  res.status(200).json({ message: "Logged out" });
});

module.exports = router;
