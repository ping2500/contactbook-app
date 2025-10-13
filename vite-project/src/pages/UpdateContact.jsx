// src/pages/UpdateContact.jsx (FINAL VERSION using AddNewContact.css styles)

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getAuthHeader } from "../utils/auth.utils";
// ⭐ Uses the CSS from the AddNewContact page
import "./AddNewContact.css";

const UpdateContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imageUrl: "",
    firstName: "",
    lastName: "",
    PhoneNumber: "",
    Email: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = "http://localhost:5000/api/contacts";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fetch Contact Data on Load (with Auth)
  useEffect(() => {
    const fetchContact = async () => {
      const headers = getAuthHeader();

      if (!headers.Authorization) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/${id}`, {
          method: "GET",
          headers: headers,
        });

        if (!response.ok) {
          throw new Error("Contact fetch failed");
        }
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching contact:", error);
        alert("Failed to load contact data. Redirecting...");
        navigate("/contact");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContact();
  }, [id, navigate]);

  // Handle Form Submission (PUT Update Contact API with Auth)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.PhoneNumber) {
      alert("First Name and Phone Number are required!");
      return;
    }

    const headers = getAuthHeader();

    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: {
          ...headers,
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Contact updated successfully!");
        // Navigate back to the view page after successful update
        navigate(`/view-contact/${id}`);
      } else {
        alert(
          `Update Failed: ${
            data.message || "Permission Denied or Data Invalid."
          }`
        );
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Error occurred during submission. Check server connection");
    }
  };

  if (isLoading) {
    // ⭐ Reusing the AddNewContact container class
    return (
      <div className="add-contact-container">Loading Contact to Edit...</div>
    );
  }

  return (
    // ⭐ Reusing the main container class for consistent styling
    <div className="add-contact-container">
      <div className="form-card">
        <h1 className="form-header">Edit Contact: {formData.firstName}</h1>

        <form className="contact-form" onSubmit={handleSubmit}>
          {/* Image URL Input */}
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            className="form-input"
            placeholder="Enter image URL"
            value={formData.imageUrl}
            onChange={handleChange}
          />
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Current Contact"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                margin: "10px 0",
              }}
            />
          )}

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
            Save Changes
          </button>

          {/* Link back to the view page */}
          <Link to={`/view-contact/${id}`} className="cancel-link">
            Cancel
          </Link>
        </form>
      </div>
    </div>
  );
};

export default UpdateContact;
