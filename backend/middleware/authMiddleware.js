const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes(get token from cookie)
const protected = async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.user.id).select("-password"); //Exclude password
      next();
    } catch (error) {
      console.error("Token verification failed: ", error);
      res.status(401).json({ message: "Not Authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not Authorized, no token provided" });
  }
};

// Middleware to check if its an admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protected, adminOnly };
