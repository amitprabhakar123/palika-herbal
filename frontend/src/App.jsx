import React, { useEffect, useState } from "react";

import Login from "./login";
import Signup from "./signup";
import Checkout from "./checkout";

import {
  addToCart as addToCartAPI,
  getCart,
  updateCart,
  removeFromCart,
} from "./api";

import "./App.css";

/* =========================
   PRODUCTS
========================= */

const products = [
  {
    id: 1,
    name: "Natural Herbal Hair Oil",
    category: "Hair Care",
    price: 399,
    oldPrice: 499,
    rating: 4.7,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=700",
  },

  {
    id: 2,
    name: "Aloe Vera Herbal Face Gel",
    category: "Skin Care",
    price: 299,
    oldPrice: 399,
    rating: 4.6,
    reviews: 96,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=700",
  },

  {
    id: 3,
    name: "Organic Neem Face Wash",
    category: "Skin Care",
    price: 249,
    oldPrice: 299,
    rating: 4.8,
    reviews: 154,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=700",
  },

  {
    id: 4,
    name: "Herbal Shampoo",
    category: "Hair Care",
    price: 349,
    oldPrice: 449,
    rating: 4.5,
    reviews: 87,
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=700",
  },

  {
    id: 5,
    name: "Organic Rose Face Cream",
    category: "Skin Care",
    price: 449,
    oldPrice: 549,
    rating: 4.7,
    reviews: 73,
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=700",
  },

  {
    id: 6,
    name: "Herbal Hair Serum",
    category: "Hair Care",
    price: 499,
    oldPrice: 599,
    rating: 4.8,
    reviews: 112,
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=700",
  },

  {
    id: 7,
    name: "Natural Turmeric Face Pack",
    category: "Bio Organic",
    price: 199,
    oldPrice: 249,
    rating: 4.6,
    reviews: 65,
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=700",
  },

  {
    id: 8,
    name: "Herbal Body Lotion",
    category: "Body Care",
    price: 379,
    oldPrice: 449,
    rating: 4.5,
    reviews: 54,
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700",
  },
];

/* =========================
   APP
========================= */

function App() {
  const [cart, setCart] = useState([]);

  const [showCart, setShowCart] = useState(false);

  const [showCheckout, setShowCheckout] = useState(false);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  /* AUTH */

  const [authPage, setAuthPage] = useState("none");

  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  /* USER ID */

  const userId = localStorage.getItem("userId");

  /* =========================
     LOAD CART
  ========================= */

  useEffect(() => {
    const loadCart = async () => {
      if (!userId || !isLoggedIn) {
        setCart([]);
        return;
      }

      try {
        const response = await getCart(userId);

        const backendItems = response.data?.items || [];

        const formattedCart = backendItems.map((item) => {
          const product = products.find(
            (p) => String(p.id) === String(item.productId)
          );

          return {
            ...(product || {}),

            id: Number(item.productId),

            name: item.name,

            price: item.price,

            quantity: item.quantity,

            image:
              product?.image ||
              "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=700",
          };
        });

        setCart(formattedCart);
      } catch (error) {
        console.error("Cart loading error:", error);
      }
    };

    loadCart();
  }, [userId, isLoggedIn]);

  /* =========================
     LOGIN
  ========================= */

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);

    setAuthPage("none");

    setShowAccountMenu(false);
  };

  /* =========================
     SIGNUP
  ========================= */

  const handleSignupSuccess = () => {
    setAuthPage("login");
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem("userId");

    localStorage.removeItem("isLoggedIn");

    localStorage.removeItem("token");

    setIsLoggedIn(false);

    setCart([]);

    setShowAccountMenu(false);

    setShowCart(false);

    setShowCheckout(false);

    alert("Logout successful 👋");
  };

  /* =========================
     ACCOUNT CLICK
  ========================= */

  const handleAccountClick = () => {
    setShowAccountMenu((current) => !current);
  };

  /* =========================
     ADD TO CART
  ========================= */

  const addToCart = async (product) => {
    const currentUserId = localStorage.getItem("userId");

    const loggedIn =
      localStorage.getItem("isLoggedIn") === "true";

    /* USER LOGIN CHECK */

    if (!loggedIn || !currentUserId) {
      alert("Please login first to add products to cart.");

      setAuthPage("login");

      return;
    }

    setLoading(true);

    try {
      await addToCartAPI({
        userId: currentUserId,

        productId: String(product.id),

        name: product.name,

        price: product.price,

        quantity: 1,
      });

      setCart((currentCart) => {
        const existingProduct = currentCart.find(
          (item) => item.id === product.id
        );

        if (existingProduct) {
          return currentCart.map((item) =>
            item.id === product.id
              ? {
                  ...item,

                  quantity: item.quantity + 1,
                }
              : item
          );
        }

        return [
          ...currentCart,

          {
            ...product,

            quantity: 1,
          },
        ];
      });

      setShowCart(true);

    } catch (error) {
      console.error("Add cart error:", error);

      alert(
        error.response?.data?.message ||
          "Product cart mein add nahi hua"
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     INCREASE QUANTITY
  ========================= */

  const increaseQuantity = async (item) => {
    const currentUserId =
      localStorage.getItem("userId");

    if (!currentUserId) {
      alert("Please login again.");

      setAuthPage("login");

      return;
    }

    const newQuantity = item.quantity + 1;

    try {
      await updateCart({
        userId: currentUserId,

        productId: String(item.id),

        quantity: newQuantity,
      });

      setCart((currentCart) =>
        currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,

                quantity: newQuantity,
              }
            : cartItem
        )
      );

    } catch (error) {
      console.error(
        "Quantity update error:",
        error
      );

      alert("Quantity update nahi hui");
    }
  };

  /* =========================
     DECREASE QUANTITY
  ========================= */

  const decreaseQuantity = async (item) => {
    const currentUserId =
      localStorage.getItem("userId");

    if (!currentUserId) {
      alert("Please login again.");

      setAuthPage("login");

      return;
    }

    const newQuantity = item.quantity - 1;

    try {
      /* REMOVE IF ZERO */

      if (newQuantity <= 0) {
        await removeFromCart({
          userId: currentUserId,

          productId: String(item.id),
        });

        setCart((currentCart) =>
          currentCart.filter(
            (cartItem) =>
              cartItem.id !== item.id
          )
        );

        return;
      }

      /* UPDATE */

      await updateCart({
        userId: currentUserId,

        productId: String(item.id),

        quantity: newQuantity,
      });

      setCart((currentCart) =>
        currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,

                quantity: newQuantity,
              }
            : cartItem
        )
      );

    } catch (error) {
      console.error(
        "Quantity update error:",
        error
      );

      alert("Quantity update nahi hui");
    }
  };

  /* =========================
     REMOVE PRODUCT
  ========================= */

  const removeProduct = async (item) => {
    const currentUserId =
      localStorage.getItem("userId");

    if (!currentUserId) {
      alert("Please login again.");

      setAuthPage("login");

      return;
    }

    try {
      await removeFromCart({
        userId: currentUserId,

        productId: String(item.id),
      });

      setCart((currentCart) =>
        currentCart.filter(
          (cartItem) =>
            cartItem.id !== item.id
        )
      );

    } catch (error) {
      console.error(
        "Remove error:",
        error
      );

      alert("Product remove nahi hua");
    }
  };

  /* =========================
     TOTAL ITEMS
  ========================= */

  const totalItems = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  /* =========================
     TOTAL PRICE
  ========================= */

  const totalPrice = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.quantity),

    0
  );

  /* =========================
     SEARCH
  ========================= */

  const filteredProducts =
    products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  /* =========================
     AUTH PAGE
  ========================= */

  if (authPage === "login") {
    return (
      <Login
        onLogin={handleLoginSuccess}
        onSwitch={() =>
          setAuthPage("signup")
        }
      />
    );
  }

  if (authPage === "signup") {
    return (
      <Signup
        onSignup={handleSignupSuccess}
        onSwitch={() =>
          setAuthPage("login")
        }
      />
    );
  }

  /* =========================
     CHECKOUT PAGE
  ========================= */

  if (showCheckout) {
    return (
      <Checkout
        cart={cart}

        totalPrice={totalPrice}

        userId={userId}

        onBack={() =>
          setShowCheckout(false)
        }

        onOrderSuccess={() => {
          setCart([]);

          setShowCheckout(false);

          setShowCart(false);
        }}
      />
    );
  }

  /* =========================
     MAIN WEBSITE
  ========================= */

  return (
    <div className="app">

      {/* =========================
          OFFER BAR
      ========================= */}

      <div className="offer-bar">
        🎁 Order above ₹999 & Get Free Gifts
        {" | "}
        🌿 15% Extra Discount on All Orders
      </div>

      {/* =========================
          HEADER
      ========================= */}

      <header className="header">

        {/* LOGO */}

        <div className="logo">

          <span>🌿</span>

          <div>

            <h1>Palika Herbal</h1>

            <small>
              Pure • Natural • Herbal
            </small>

          </div>

        </div>

        {/* SEARCH */}

        <div className="search">

          <input
            type="text"
            placeholder="Search for Herbal Products"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button type="button">
            🔍
          </button>

        </div>

        {/* HEADER ACTIONS */}

        <div className="header-actions">

          {/* STORE */}

          <button type="button">
            📍
            <br />
            Store
          </button>

          {/* CART */}

          <button
            type="button"
            className="cart"
            onClick={() =>
              setShowCart(true)
            }
          >
            🛒 Cart

            <span>
              {totalItems}
            </span>
          </button>

          {/* ACCOUNT */}

          <div className="account-wrapper">

            <button
              type="button"
              className="account-button"
              onClick={
                handleAccountClick
              }
            >
              👤
              <br />
              Account
            </button>

            {/* ACCOUNT MENU */}

            {showAccountMenu && (

              <div className="account-menu">

                {isLoggedIn ? (

                  <>
                    <div className="account-menu-title">
                      👤 My Account
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowAccountMenu(
                          false
                        )
                      }
                    >
                      📦 My Orders
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setShowAccountMenu(
                          false
                        )
                      }
                    >
                      ❤️ Wishlist
                    </button>

                    <button
                      type="button"
                      className="logout-btn"
                      onClick={
                        handleLogout
                      }
                    >
                      🚪 Logout
                    </button>
                  </>

                ) : (

                  <>
                    <div className="account-menu-title">
                      👤 Welcome
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthPage(
                          "login"
                        );

                        setShowAccountMenu(
                          false
                        );
                      }}
                    >
                      🔐 Login
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthPage(
                          "signup"
                        );

                        setShowAccountMenu(
                          false
                        );
                      }}
                    >
                      📝 Sign Up
                    </button>
                  </>

                )}

              </div>

            )}

          </div>

        </div>

      </header>

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar">

        <a href="#products">
          Hair Care
        </a>

        <a href="#products">
          Skin Care
        </a>

        <a href="#products">
          Face Care
        </a>

        <a href="#products">
          Body Care
        </a>

        <a href="#products">
          Bio Organic
        </a>

        <a href="#products">
          Best Seller
        </a>

        <a href="#products">
          Super Deals
        </a>

        <a href="#products">
          Gifts
        </a>

        <a href="#footer">
          About Us
        </a>

      </nav>

      {/* =========================
          HERO
      ========================= */}

      <section className="hero">

        <div className="hero-content">

          <p>
            100% NATURAL & HERBAL
          </p>

          <h2>
            Nature's Care
            <br />
            For Your Beauty
          </h2>

          <p>
            Discover premium herbal
            products made with natural
            ingredients for your everyday
            care.
          </p>

          <button
            type="button"
            className="shop-btn"
            onClick={() =>
              document
                .getElementById(
                  "products"
                )
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            SHOP NOW →
          </button>

        </div>

      </section>

      {/* =========================
          FEATURES
      ========================= */}

      <section className="features">

        <div>

          <span>🚚</span>

          <h3>
            Free Shipping
          </h3>

          <p>
            On orders above ₹499
          </p>

        </div>

        <div>

          <span>🌿</span>

          <h3>
            100% Herbal
          </h3>

          <p>
            Natural ingredients
          </p>

        </div>

        <div>

          <span>🔒</span>

          <h3>
            Secure Payment
          </h3>

          <p>
            100% secure checkout
          </p>

        </div>

        <div>

          <span>↩️</span>

          <h3>
            Easy Returns
          </h3>

          <p>
            Simple return policy
          </p>

        </div>

      </section>

      {/* =========================
          PRODUCTS
      ========================= */}

      <section
        className="products-section"
        id="products"
      >

        <div className="section-title">

          <p>
            OUR COLLECTION
          </p>

          <h2>
            Best Selling Products
          </h2>

          <span>
            Natural products carefully
            selected for you
          </span>

        </div>

        <div className="products">

          {filteredProducts.map(
            (product) => (

              <div
                className="product-card"
                key={product.id}
              >

                <div className="product-image">

                  <div className="sale">
                    Sale
                  </div>

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                </div>

                <div className="product-info">

                  <span className="category">
                    {product.category}
                  </span>

                  <h3>
                    {product.name}
                  </h3>

                  <div className="rating">

                    ⭐ {product.rating}
                    {" "}
                    ({product.reviews})

                  </div>

                  <div className="price">

                    <strong>
                      ₹{product.price}
                    </strong>

                    <del>
                      ₹{product.oldPrice}
                    </del>

                  </div>

                  <button
                    type="button"
                    className="add-cart"
                    disabled={loading}
                    onClick={() =>
                      addToCart(product)
                    }
                  >
                    {loading
                      ? "ADDING..."
                      : "ADD TO CART"}
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      </section>

      {/* =========================
          NEWSLETTER
      ========================= */}

      <section className="newsletter">

        <h2>
          Sign up for our newsletter
        </h2>

        <p>
          Get updates about new products
          and special offers.
        </p>

        <div>

          <input
            type="email"
            placeholder="Your email address"
          />

          <button type="button">
            Subscribe
          </button>

        </div>

      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer id="footer">

        <div className="footer-column">

          <h2>
            🌿 Palika Herbal
          </h2>

          <p>
            Natural and herbal beauty
            products inspired by the
            goodness of nature.
          </p>

        </div>

        <div className="footer-column">

          <h3>
            Shop
          </h3>

          <a href="#products">
            Hair Care
          </a>

          <a href="#products">
            Skin Care
          </a>

          <a href="#products">
            Face Care
          </a>

          <a href="#products">
            Body Care
          </a>

        </div>

        <div className="footer-column">

          <h3>
            Customer Services
          </h3>

          <a href="#footer">
            Contact Us
          </a>

          <a href="#footer">
            Track Your Order
          </a>

          <a href="#footer">
            Shipping Policy
          </a>

          <a href="#footer">
            Returns & Refunds
          </a>

        </div>

        <div className="footer-column">

          <h3>
            Contact
          </h3>

          <p>
            📞 +91 9876543210
          </p>

          <p>
            ✉️ support@palikaherbal.com
          </p>

          <p>
            📍 India
          </p>

        </div>

      </footer>

      {/* COPYRIGHT */}

      <div className="copyright">

        © 2026 Palika Herbal.
        All Rights Reserved.

      </div>

      {/* =========================
          PROFESSIONAL CART
      ========================= */}

      {showCart && (

        <div
          className="cart-overlay"
          onClick={() =>
            setShowCart(false)
          }
        >

          <div
            className="cart-drawer"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CART TOP */}

            <div className="cart-top">

              <div>

                <h2>
                  Your Cart
                </h2>

                <span>
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "item"
                    : "items"}
                </span>

              </div>

              <button
                type="button"
                className="cart-close"
                onClick={() =>
                  setShowCart(false)
                }
              >
                ✕
              </button>

            </div>

            {/* OFFER */}

            <div className="cart-offer">

              🎁{" "}
              <strong>
                Monthly Herbal Sale is Live
              </strong>{" "}
              🎁

            </div>

            {/* REWARDS */}

            <div className="cart-rewards">

              <h3>
                You have unlocked your
                rewards!
              </h3>

              <div className="reward-prices">

                <span>
                  ₹499
                </span>

                <span>
                  ₹999
                </span>

                <span>
                  ₹1499
                </span>

              </div>

              <div className="reward-line">

                <div className="reward-dot">
                  🚚
                </div>

                <div className="reward-dot">
                  🎁
                </div>

                <div className="reward-dot">
                  🎁
                </div>

              </div>

              <div className="reward-text">

                <span>
                  Free Shipping
                </span>

                <span>
                  1 Free Gift
                </span>

                <span>
                  2 Free Gifts
                </span>

              </div>

            </div>

            {/* EMPTY CART */}

            {cart.length === 0 ? (

              <div className="empty-cart">

                <div className="empty-cart-icon">
                  🛒
                </div>

                <h3>
                  Your cart is empty
                </h3>

                <p>
                  Add some herbal products
                  to your cart.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setShowCart(false)
                  }
                >
                  CONTINUE SHOPPING
                </button>

              </div>

            ) : (

              <>

                {/* CART ITEMS */}

                <div className="cart-items">

                  {cart.map((item) => (

                    <div
                      className="professional-cart-item"
                      key={item.id}
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <div className="cart-product-details">

                        <h3>
                          {item.name}
                        </h3>

                        <div className="cart-price">
                          ₹{item.price}
                        </div>

                        <div className="cart-quantity-row">

                          <div className="quantity-box">

                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(
                                  item
                                )
                              }
                            >
                              −
                            </button>

                            <span>
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(
                                  item
                                )
                              }
                            >
                              +
                            </button>

                          </div>

                          <button
                            type="button"
                            className="delete-cart"
                            onClick={() =>
                              removeProduct(
                                item
                              )
                            }
                          >
                            🗑️
                          </button>

                        </div>

                        <button
                          type="button"
                          className="remove-cart"
                          onClick={() =>
                            removeProduct(
                              item
                            )
                          }
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

                {/* CART BOTTOM */}

                <div className="cart-bottom">

                  <div className="saving-message">

                    🎉 ₹
                    {totalPrice >= 999
                      ? 200
                      : totalPrice >= 499
                      ? 100
                      : 0}
                    .00 Saved so far!

                  </div>

                  <div className="summary-row">

                    <span>
                      Subtotal
                    </span>

                    <strong>
                      ₹{totalPrice}
                    </strong>

                  </div>

                  <div className="summary-row">

                    <span>
                      Shipping
                    </span>

                    <strong>
                      {totalPrice >= 499
                        ? "FREE"
                        : "₹49"}
                    </strong>

                  </div>

                  <div className="summary-total">

                    <span>
                      Estimated Total
                    </span>

                    <strong>
                      ₹
                      {totalPrice >= 499
                        ? totalPrice
                        : totalPrice + 49}
                    </strong>

                  </div>

                  <p className="discount-text">
                    🎁 Get extra discount on
                    prepaid orders
                  </p>

                  <button
                    type="button"
                    className="professional-checkout"
                    onClick={() => {

                      if (!userId) {

                        alert(
                          "Please login first."
                        );

                        setShowCart(false);

                        setAuthPage(
                          "login"
                        );

                        return;
                      }

                      setShowCart(false);

                      setShowCheckout(true);

                    }}
                  >
                    Checkout →
                  </button>

                </div>

              </>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default App;