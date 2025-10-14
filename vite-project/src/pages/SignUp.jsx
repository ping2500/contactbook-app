import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";

const API_BASE = "http://localhost:5000/api"; // API Base URL

const SignupPage = () => {
  const navigate = useNavigate();
  // Add state for username
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Basic validation for all fields
    if (!username || !email || !password) {
      alert("All fields are required.");
      return;
    }

    try {
      // API Call to the backend's sign-up endpoint
      const response = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        //  Send username, email, and password to the server
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful! Please log in.");
        navigate("/"); // Navigate to Login page on success
      } else {
        // Display the error message from the backend (e.g., 'Email is already registered.')
        alert(`Signup Failed: ${data.message || "An unknown error occurred."}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("A network error has occurred. Check server connection.");
    }
  };

  return (
    <div className="signup-page-container">
      <div className="auth-card">
        <h1 className="auth-header">Signup</h1>

        <form className="auth-form" onSubmit={handleSignup}>
          {/*  USERNAME FIELD */}
          <input
            type="text"
            placeholder="Username"
            className="auth-input"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Create password"
            className="auth-input"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm password"
            className="auth-input"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" className="auth-button primary-button">
            Signup
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/" className="switch-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
