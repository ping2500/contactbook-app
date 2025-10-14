
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Contacts.css";

// utility file for getting the token and user info
import { getAuthHeader, isAdmin, logout } from "../utils/auth.utils";

const Contacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // NEW STATE: Store the user object for display
  const [loggedInUser, setLoggedInUser] = useState(null);
  //state for search functionality
  const [searchTerm, setSearchTerm]= useState('');

  const API_BASE = "http://localhost:5000/api/contacts";
  
  // authentication check
  const token = localStorage.getItem("authToken");
  if (!token) {
    logout(); 
    useEffect(() => { navigate("/"); }, [navigate]);
    return null;
  }
  
 // search functionality
  const filteredContacts = useMemo(() => { // useMemo memorize a value and to do complex calculation
    if (!searchTerm) {
      return contacts;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();

    return contacts.filter(contact => 
      contact.firstName.toLowerCase().includes(lowerCaseSearch) ||
      contact.lastName.toLowerCase().includes(lowerCaseSearch) ||
      contact.Email.toLowerCase().includes(lowerCaseSearch) ||
      contact.PhoneNumber.includes(lowerCaseSearch)
    );
  }, [contacts, searchTerm]); // Recalculate only when contacts or searchTerm changes


  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const token = localStorage.getItem("authToken");

    if (!token || !userJson) {
      // If no token or user data, the user is NOT logged in.
      alert("User already logged in ");
      logout(); // Clean up any potentially bad local storage data
       // Redirect to Login page
      navigate("/");
      return; // Stop execution of this effect
    }

    try {
      setLoggedInUser(JSON.parse(userJson));
    } catch (e) {
      // Failed to parse user JSON
      logout();
    
      return;
    }

    // If logged in, proceed to fetch contacts
    fetchContacts();
  }, [navigate]); // navigate is a dependency

  const handleLogout = () => {
    logout(); // Calls the utility to clear localStorage
    navigate("/"); // Redirects to the login page
  };

  const handleViewClick = (e, id) => {
    e.preventDefault();
    navigate(`/view-contact/${id}`);
  };

  const handleDelete = async (e, contactId) => {
    e.preventDefault();
    if (
      !window.confirm(
        "Are you sure you want to delete this contact? This action cannot be undone."
      )
    ) {
      return;
    }

    const headers = getAuthHeader();

    try {
      const response = await fetch(`${API_BASE}/${contactId}`, {
        method: "DELETE",
        headers: headers, // Requires Admin token
      });

      if (response.ok) {
        alert("Contact deleted successfully!");
        fetchContacts();
      } else {
        const data = await response.json();
        alert(
          `Deletion failed: ${
            data.message || "Permission Denied. Are you logged in as Admin?"
          }`
        );
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("A network error occurred during deletion.");
    }
  };

  // --- Data Fetching ---

  const fetchContacts = async () => {
    setIsLoading(true);
    const headers = getAuthHeader();

    try {
      const response = await fetch(API_BASE, {
        method: "GET",
        headers: headers,
      });

      if (response.status === 401 || response.status === 403) {
        logout();
        navigate("/");
        throw new Error("Unauthorized or Token Expired.");
      }

      const data = await response.json();
      setContacts(data);
    } catch (err) {
      console.error("Fetch Contacts Error:", err);
    } finally {
      setIsLoading(false);
    }
  };


  // --- Render ---

  if (isLoading) {
    return (
      <div className="contact-list-page-container">Loading contacts...</div>
    );
  }

  //  New Header Component (Top Header)
  const UserHeader = () => (
    <div className="user-header">
      {loggedInUser && (
        <div className="user-info">
          Welcome,{" "}
          <strong>{loggedInUser.username || loggedInUser.email}</strong>! (
          {loggedInUser.role})
        </div>
      )}
      <button onClick={handleLogout} className="logout-button action-button">
        <i className="fas fa-sign-out-alt"></i> Logout
      </button>
    </div>
  );

  return (
    <div className="contact-list-page-container">
      {/* NEW: User Info and Logout Header */}
      <UserHeader />

      <div className="search-filter-section">
        <input
          type="text"
          placeholder="Search contacts by Name..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Only show New Contact button if user is Admin */}
        {isAdmin() && (
          <Link to="/add-contact" className="new-contact-button">
            Click to Add New Contact
          </Link>
        )}
      </div>

      {/* Contact Table */}
      <div className="contact-table-wrapper">
        <table>
          <thead>
            <tr>
              <th className="contact-col">Contact</th>
              <th>FIRST NAME</th>
              <th>LAST NAME</th>
              <th>Phone number</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <tr key={contact.id}>
                  <td>
                    <img
                      src={
                        contact.imageUrl || //OR operator
                        "https://via.placeholder.com/50/CCCCCC/FFFFFF?text=C"
                      }
                      alt={`${contact.firstName} ${contact.lastName}`}
                      className="contact-avatar"
                    />
                    {contact.firstName} {contact.lastName}
                  </td>
                  <td>{contact.firstName}</td>
                  <td>{contact.lastName}</td>
                  <td>{contact.PhoneNumber}</td>
                  <td>{contact.Email}</td>
                  <td className="action-buttons-cell">
                    {/* DETAILS/VIEW BUTTON */}
                    <button
                      className="action-button details-button"
                      onClick={(e) => handleViewClick(e, contact.id)}
                    >
                      <i className="fas fa-search"></i> Details
                    </button>

                    {/* Admin only: Edit and Delete buttons */}
                    {isAdmin() && (
                      <>
                        <button
                          className="action-button delete-button"
                          onClick={(e) => handleDelete(e, contact.id)}
                        >
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contacts;
