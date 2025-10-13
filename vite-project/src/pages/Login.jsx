// src/components/Login.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const API_BASE = "http://localhost:5000/api"; // API Base URL

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 // User can't access login page without logging out
  useEffect(() =>{

    const token = localStorage.getItem('authToken');

    if (token){
      alert('User is already logged in.');
      navigate('/contact');
    }
  }, [navigate]);
  
 

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        //  Store the token and user info
        localStorage.setItem("authToken", data.token);
        // Store simple user data for quick UI access
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/contact");
      } else {
        alert(data.message || "Login failed. Check your credentials.");
      }
    } catch (error) {
      console.error("Login Network Error:", error);
      alert("An error occurred. Check server connection.");
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h1 className="auth-header">Login</h1>
        
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email (e.g., admin or user)"
            className="auth-input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)} // log in for administrator
          />

          <input
            type="password"
            placeholder="Password "
            className="auth-input"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Link to="/signup" className="forgot-password">
            Forgot password?
          </Link>

          <button type="submit" className="auth-button primary-button">
            Login
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account?{" "}
          <Link to="/signup" className="switch-link">
            Signup
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
