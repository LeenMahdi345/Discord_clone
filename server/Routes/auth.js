const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();



router.post("/register", async (req, res) => {
  try {
console.log(req.body);
    const { username, email, password } = req.body;

    // check if email exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {
    res.status(500).json(error);
  }
});



router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

   
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }
    const token = jwt.sign({
  id: user._id,
  username: user.username
}, process.env.JWT_SECRET);
  
   

res.status(200).json({
  token,
  user: {
    id: user._id,
    username: user.username,
    email: user.email,
  },
});
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
console.log("auth routes loaded");
