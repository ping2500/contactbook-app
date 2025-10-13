// src/pages/ViewContact.jsx (UPDATED)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuthHeader } from "../utils/auth.utils"; // import auth.utils file
import "./ViewContact.css";

const ViewContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = "http://localhost:5000/api/contacts";

  // Handler to navigate to the update page
  const handleEditClick = () => {
    // Navigate to the UpdateContact page with the contact ID
    navigate(`/edit-contact/${contact.id}`);
  };

  // Fetch Single Contact Data (GET Single Contact API)
  useEffect(() => {
    const fetchContact = async () => {
      const headers = getAuthHeader(); // Get the token header

      if (!headers.Authorization) {
        navigate("/"); // Redirect if not logged in
        return;
      }
      try {
        const response = await fetch(`${API_BASE}/${id}`, {
          method: "GET",
          headers: headers, // Send the token with the request
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch contact: ${response.status}`);
        }

        const data = await response.json();
        setContact(data);
      } catch (error) {
        console.error("Error fetching contact:", error);
        alert("Failed to load contact data. Check if you are logged in.");
        navigate("/contact");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContact();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="view-contact-container">Loading Contact Details...</div>
    );
  }

  if (!contact) {
    return <div className="view-contact-container">Contact not found.</div>;
  }

  return (
    <div className="view-contact-container">
      {/* Back Button at the top */}
      <button onClick={() => navigate("/contact")} className="back-button">
        &larr; Back to Contacts
      </button>

      {/* Main content card for image */}
      <div className="contact-details-card-image">
        <div className="contact-image-wrapper">
          <img
            src={
              contact.imageUrl ||
              "https://via.placeholder.com/150/CCCCCC/FFFFFF?text=No+Image"
            }
            alt={`${contact.firstName} ${contact.lastName}`}
            className="contact-detail-image"
          />
        </div>
      </div>

      {/* Contact Name and Edit Button Block */}
      <div className="contact-details-card-name">
        <h1 className="detail-value-large">{contact.firstName}</h1>
        <h1 className="detail-value-large">{contact.lastName}</h1>

        {/* Edit Button is added here */}
        <button onClick={handleEditClick} className="edit-detail-button">
          <i className="fas fa-edit"></i> Edit Contact
        </button>
      </div>

      {/* Contact Info Block */}
      <div className="contact-details-card-info">
        <p className="detail-label">PHONE NUMBER</p>
        <h2 className="detail-value">{contact.PhoneNumber}</h2>
        <p className="detail-label">EMAIL</p>
        <h2 className="detail-value">{contact.Email}</h2>
      </div>
    </div>
  );
};

export default ViewContact;
