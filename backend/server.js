const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Database connection import karein (agar aapne CommonJS require use kiya hai)
const connectDB = require("./config/db");// path apne folder structure ke mutabiq check kar lein

const app = express();
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Database Connect karein
connectDB();

// Test Route
app.get("/", (req, res) => {
    res.send("Palika Herbal Backend is running 🚀");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});