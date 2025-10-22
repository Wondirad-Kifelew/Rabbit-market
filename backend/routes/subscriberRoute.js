const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");

// post /api/subscriber
// desc handle newslettersubscription
// access public

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email not found" });
  }
  try {
    // check if emial is already subscibed
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber)
      return res.status(400).json({ message: "User is already subscribed" });
    // create a new subscriber if its not subscribed

    subscriber = new Subscriber({ email });
    await subscriber.save();
    res
      .status(201)
      .json({ message: "Successfully subscribed to the newsletter" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
