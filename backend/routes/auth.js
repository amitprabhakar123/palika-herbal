const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

const router = express.Router();

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("SIGNUP REQUEST:", {
      name,
      email,
    });

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
    });

    console.log("USER CREATED:", user._id);

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);

    return res.status(500).json({
      message: error.message || "Signup failed",
    });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN REQUEST:", email);

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // JWT SECRET CHECK
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in .env");

      return res.status(500).json({
        message: "JWT_SECRET is missing in .env file",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,

      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
      },

      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: error.message || "Login failed",
    });
  }
});

module.exports = router;