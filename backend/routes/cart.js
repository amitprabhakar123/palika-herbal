const express = require("express");
const router = express.Router();
const Cart = require("../model/cart");

// Add product to cart
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, name, price, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, name, price, quantity: quantity || 1 }]
      });
    } else {
      const existingItem = cart.items.find(
        item => item.productId === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity || 1;
      } else {
        cart.items.push({
          productId,
          name,
          price,
          quantity: quantity || 1
        });
      }
    }

    await cart.save();

    res.status(200).json({
      message: "Product added to cart",
      cart
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding product",
      error: error.message
    });
  }
});

// Get cart
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.params.userId
    });

    res.json(cart || { userId: req.params.userId, items: [] });
  } catch (error) {
    res.status(500).json({
      message: "Error getting cart",
      error: error.message
    });
  }
});
// Update product quantity
router.put("/update", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    const item = cart.items.find(
      item => item.productId === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not found in cart"
      });
    }

    item.quantity = quantity;

    await cart.save();

    res.json({
      message: "Cart quantity updated",
      cart
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating cart",
      error: error.message
    });
  }
});


// Remove product from cart
router.delete("/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(
      item => item.productId !== productId
    );

    await cart.save();

    res.json({
      message: "Product removed from cart",
      cart
    });

  } catch (error) {
    res.status(500).json({
      message: "Error removing product",
      error: error.message
    });
  }
});


// YE SABSE LAST MEIN RAHEGA
module.exports = router;