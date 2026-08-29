import React, { useState } from "react";
import axios from "axios";

function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("Login response:", response.data);

      // Backend se user ID
      const userId =
        response.data.user?._id ||
        response.data.userId ||
        response.data._id;

      if (!userId) {
  console.error("User ID not found:", response.data);

  alert("Login successful, but User ID nahi mili.");
  return;
}

   localStorage.setItem("userId", userId);
   localStorage.setItem("isLoggedIn", "true");

  console.log("Saved User ID:", userId);

  alert("Login successful 🎉");

onLogin();
    } catch (error) {
      console.error("Login error:", error);

      alert(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-box">

        <div className="auth-logo">
          🌿
        </div>

        <h1>Palika Herbal</h1>

        <p className="auth-tagline">
          Pure • Natural • Herbal
        </p>

        <h2>Welcome Back</h2>

        <p className="auth-subtitle">
          Login to continue shopping
        </p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "LOGIN..." : "LOGIN"}
          </button>

        </form>

        <p className="switch-auth">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
          >
            Sign Up
          </button>
        </p>

      </div>

    </div>
  );
}

export default Login;