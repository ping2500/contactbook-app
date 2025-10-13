
/* saad@gmail.com 
    ali234
// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Create this CSS file next

const Login = () => {
    // State for form inputs (optional, but good practice)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // --- Authentication Logic Placeholder ---
        // In a real application, you would make an API call (e.g., using axios) here:
        // axios.post('http://localhost:5000/api/login', { username, password })
        //     .then(response => {
        //         if (response.data.success) {
        //             // Store token/user info
        //             navigate('/contacts'); // Navigate to the contact page
        //         } else {
        //             alert('Login failed. Check credentials.');
        //         }
        //     })
        //     .catch(error => alert('An error occurred during login.'));
        
        // --- Simulated Success ---
        console.log(`Attempting login for: ${username}`);
        
        // After successful login (simulated here), navigate to the contact list page.
        // We'll use the route path /contacts for the main list page.
        if (username && password) {
            navigate('/contacts'); 
        } else {
             alert('Please enter username and password.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Phone Contacts</h1>
                <p>Welcome! Please log in.</p>
                
                <form onSubmit={handleLogin}>
                    <div className="login-input-group">
                        <i className="material-icons">person</i>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-input-group">
                        <i className="material-icons">lock</i>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="login-button">
                        LOGIN
                    </button>
                    
                    <div className="admin-link">
                         <a href="#">Admin Login</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login; */