import React, { useState } from "react";
import axios from "axios";

function Signup({ onSignup, onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://palika-herbal.onrender.com/api/auth/signup",
        {
          name,
          email,
          password,
        }
      );

      console.log("Signup response:", response.data);

      alert("Signup successful 🎉");

      onSignup();

    } catch (error) {
      console.error("Signup error:", error);

      alert(
        error.response?.data?.message ||
          "Signup failed"
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

        <h2>Create Account</h2>

        <p className="auth-subtitle">
          Join Palika Herbal today
        </p>

        <form onSubmit={handleSignup}>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

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
            placeholder="Create password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "CREATING..." : "SIGN UP"}
          </button>

        </form>

        <p className="switch-auth">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
          >
            Login
          </button>
        </p>

      </div>

    </div>
  );
}

export default Signup;