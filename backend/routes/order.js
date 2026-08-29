const express = require("express");
const Order = require("../model/order");
const Cart = require("../model/cart");

const router = express.Router();

// ===============================
// PLACE ORDER
// ===============================

router.post("/create", async (req, res) => {
  try {
    const {
      userId,
      customerName,
      phone,
      address,
      city,
      pincode,
      paymentMethod,
    } = req.body;

    // Check required fields
    if (
      !userId ||
      !customerName ||
      !phone ||
      !address ||
      !city ||
      !pincode
    ) {
      return res.status(400).json({
        message: "All checkout fields are required",
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce(
      (total, item) =>
        total + Number(item.price) * Number(item.quantity),
      0
    );

    // Shipping
    const shipping = subtotal >= 499 ? 0 : 49;

    // Total
    const total = subtotal + shipping;

    // Create order
    const order = await Order.create({
      userId,
      customerName,
      phone,
      address,
      city,
      pincode,

      items: cart.items.map((item) => ({
        productId: String(item.productId),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || "",
      })),

      subtotal,
      shipping,
      total,

      paymentMethod: paymentMethod || "Cash on Delivery",

      status: "Order Placed",
    });

    // Empty cart after order
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } }
    );

    res.status(201).json({
      message: "Order placed successfully",
      order: {
        id: order._id,
        total: order.total,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Order error:", error);

    res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  }
});

// ===============================
// GET USER ORDERS
// ===============================

router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.params.userId,
    }).sort({
      createdAt: -1,
    });

    res.json({
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      message: "Failed to get orders",
    });
  }
});

module.exports = router;