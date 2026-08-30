import React, { useState } from "react";
import "./App.css";

function Checkout({
  cart = [],
  totalPrice = 0,
  userId,
  onBack,
  onOrderSuccess,
}) {
  const [showAddress, setShowAddress] = useState(false);

  const [address, setAddress] = useState({
    pincode: "",
    city: "",
    state: "",
    flat: "",
    area: "",
    name: "",
    email: "",
    mobile: "",
    saveAs: "Home",
  });

  const [payment, setPayment] = useState("COD");

  const shipping = totalPrice >= 499 ? 0 : 49;
  const grandTotal = totalPrice + shipping;

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handlePincode = (e) => {
    const value = e.target.value;

    setAddress({
      ...address,
      pincode: value,
      city: value === "110044" ? "SOUTH DELHI" : "",
      state: value === "110044" ? "DELHI" : "",
    });
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();

    if (
      !address.pincode ||
      !address.flat ||
      !address.area ||
      !address.name ||
      !address.email
    ) {
      alert("Please fill all required fields");
      return;
    }

    setShowAddress(false);
  };

  const placeOrder = async () => {
    if (!address.name || !address.pincode || !address.area) {
      setShowAddress(true);
      return;
    }

    try {
      const response = await fetch(
        "https://palika-herbal.onrender.com/api/orders/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            items: cart,
            totalAmount: grandTotal,
            shippingAddress: address,
            paymentMethod: payment,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Order failed");
        return;
      }

      alert("Order placed successfully 🎉");

      if (onOrderSuccess) {
        onOrderSuccess();
      }
    } catch (error) {
      console.error(error);
      alert("Backend server se connection nahi ho raha");
    }
  };

  return (
    <div className="checkout-page">

      {/* HEADER */}
      <div className="checkout-header">

        <button
          className="back-cart-btn"
          onClick={onBack}
        >
          ← Back to Cart
        </button>

        <div>
          <h1>Checkout</h1>
          <p>Complete your order</p>
        </div>

      </div>

      {/* MAIN CHECKOUT */}
      <div className="checkout-container">

        {/* LEFT */}
        <div className="checkout-left">

          <div className="checkout-card">

            <h2>Delivery Details</h2>

            <button
              className="address-open-btn"
              onClick={() => setShowAddress(true)}
            >
              + Add Delivery Address
            </button>

            {address.name && (
              <div className="selected-address">

                <strong>{address.name}</strong>

                <p>
                  {address.flat}, {address.area}
                </p>

                <p>
                  {address.city}, {address.state} -{" "}
                  {address.pincode}
                </p>

                {address.mobile && (
                  <p>Mobile: {address.mobile}</p>
                )}

                <button
                  onClick={() => setShowAddress(true)}
                >
                  Edit Address
                </button>

              </div>
            )}

          </div>

          {/* PAYMENT */}
          <div className="checkout-card">

            <h2>Payment Method</h2>

            <label className="payment-option">

              <input
                type="radio"
                value="COD"
                checked={payment === "COD"}
                onChange={(e) =>
                  setPayment(e.target.value)
                }
              />

              <div>
                <strong>Cash on Delivery</strong>
                <p>Pay when your order is delivered</p>
              </div>

            </label>

            <label className="payment-option">

              <input
                type="radio"
                value="ONLINE"
                checked={payment === "ONLINE"}
                onChange={(e) =>
                  setPayment(e.target.value)
                }
              />

              <div>
                <strong>Online Payment</strong>
                <p>Pay securely online</p>
              </div>

            </label>

            <button
              className="place-order-btn"
              onClick={placeOrder}
            >
              PLACE ORDER • ₹{grandTotal}
            </button>

          </div>

        </div>

        {/* RIGHT */}
        <div className="checkout-right">

          <div className="checkout-card">

            <h2>Order Summary</h2>

            <div className="checkout-products">

              {cart.map((item, index) => (

                <div
                  className="checkout-product"
                  key={item._id || item.id || index}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div>

                    <h3>{item.name}</h3>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                    <strong>
                      ₹{item.price * item.quantity}
                    </strong>

                  </div>

                </div>

              ))}

            </div>

            <div className="price-row">
              <span>Subtotal</span>
              <strong>₹{totalPrice}</strong>
            </div>

            <div className="price-row">
              <span>Shipping</span>
              <strong>
                {shipping === 0
                  ? "FREE"
                  : `₹${shipping}`}
              </strong>
            </div>

            <div className="checkout-total">
              <span>Total</span>
              <strong>₹{grandTotal}</strong>
            </div>

          </div>

        </div>

      </div>

      {/* ADDRESS MODAL */}
      {showAddress && (

        <div
          className="address-overlay"
          onClick={() => setShowAddress(false)}
        >

          <div
            className="address-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="address-modal-header">

              <h2>Add Delivery Address</h2>

              <button
                onClick={() => setShowAddress(false)}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleAddressSubmit}>

              <h3>Shipping Address</h3>

              {/* PINCODE */}
              <div className="input-group">

                <label>Pincode *</label>

                <input
                  type="text"
                  name="pincode"
                  value={address.pincode}
                  onChange={handlePincode}
                  placeholder="Enter pincode"
                  maxLength="6"
                  required
                />

              </div>

              {/* CITY STATE */}
              <div className="two-inputs">

                <div className="input-group">

                  <label>City *</label>

                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />

                </div>

                <div className="input-group">

                  <label>State *</label>

                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                  />

                </div>

              </div>

              {/* FLAT */}
              <div className="input-group">

                <label>Flat, House no. *</label>

                <input
                  type="text"
                  name="flat"
                  value={address.flat}
                  onChange={handleChange}
                  placeholder="Flat, House no."
                  required
                />

              </div>

              {/* AREA */}
              <div className="input-group">

                <label>
                  Apartment, Area, Sector, Village *
                </label>

                <input
                  type="text"
                  name="area"
                  value={address.area}
                  onChange={handleChange}
                  placeholder="Apartment, Area, Sector, Village"
                  required
                />

              </div>

              <h3>Customer Information</h3>

              {/* NAME */}
              <div className="input-group">

                <label>Full Name *</label>

                <input
                  type="text"
                  name="name"
                  value={address.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                />

              </div>

              {/* EMAIL */}
              <div className="input-group">

                <label>Email Address *</label>

                <input
                  type="email"
                  name="email"
                  value={address.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                />

              </div>

              {/* MOBILE */}
              <div className="input-group">

                <label>Mobile Number</label>

                <input
                  type="tel"
                  name="mobile"
                  value={address.mobile}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                />

              </div>

              {/* SAVE ADDRESS */}
              <h3>Save Address As</h3>

              <div className="save-address">

                <button
                  type="button"
                  className={
                    address.saveAs === "Home"
                      ? "save-active"
                      : ""
                  }
                  onClick={() =>
                    setAddress({
                      ...address,
                      saveAs: "Home",
                    })
                  }
                >
                  Home
                </button>

                <button
                  type="button"
                  className={
                    address.saveAs === "Work"
                      ? "save-active"
                      : ""
                  }
                  onClick={() =>
                    setAddress({
                      ...address,
                      saveAs: "Work",
                    })
                  }
                >
                  Work
                </button>

              </div>

              <button
                className="continue-address-btn"
                type="submit"
              >
                Continue
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Checkout;