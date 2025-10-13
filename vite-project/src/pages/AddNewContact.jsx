// src/pages/AddNewContact.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AddNewContact.css";
// ⭐ 1. Import the utility to fetch the JWT token
import { getAuthHeader } from "../utils/auth.utils"; // Assuming path is correct

const AddNewContact = () => {
  const navigate = useNavigate();
  const API_BASE = "http://localhost:5000/api/contacts";

  const [formData, setFormData] = useState({
    imageUrl: "",
    firstName: "",
    lastName: "",
    PhoneNumber: "",
    Email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic check before submitting
    if (!formData.firstName || !formData.PhoneNumber) {
      alert("First Name and Phone Number are required.");
      return;
    }

    // ⭐ 2. Get Authorization Headers
    const authHeaders = getAuthHeader();

    if (!authHeaders.Authorization) {
      alert(
        "Your session has expired or you are not logged in. Redirecting to login."
      );
      navigate("/");
      return;
    }

    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: {
          // ⭐ 3. Combine Auth Header and Content Type
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Contact added successfully!");
        navigate("/contact");
      } else {
        // ⭐ 4. Fixed template literal using backticks (`)
        alert(
          `Submission Failed: ${data.message || "Check network connection."}`
        );
        console.error("Submission Error:", data);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Error occurred during submission. Check server connection");
    }
  };

  return (
    <div className="add-contact-container">
      <div className="add-contact-card">
        <h1 className="add-contact-header">Add New Contact</h1>

        <form className="add-contact-form" onSubmit={handleSubmit}>
          {/* Image URL Input */}
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            className="form-input"
            placeholder="Paste image URL here"
            value={formData.imageUrl}
            onChange={handleChange}
          />

          {/* First Name Input */}
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="form-input"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          {/* Last Name Input */}
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="form-input"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={handleChange}
          />

          {/* Phone Number Input */}
          <label htmlFor="PhoneNumber">Phone Number *</label>
          <input
            type="tel"
            id="PhoneNumber"
            name="PhoneNumber"
            className="form-input"
            placeholder="Enter phone number"
            value={formData.PhoneNumber}
            onChange={handleChange}
            required
          />

          {/* Email Input */}
          <label htmlFor="Email">Email</label>
          <input
            type="email"
            id="Email"
            name="Email"
            className="form-input"
            placeholder="Enter email address"
            value={formData.Email}
            onChange={handleChange}
          />

          <button type="submit" className="submit-button primary-button">
            Submit Contact
          </button>

          <Link to="/contact" className="cancel-link">
            Cancel
          </Link>
        </form>
      </div>
    </div>
  );
};

export default AddNewContact;
