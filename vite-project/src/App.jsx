import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; 
import './App.css'; 
import Contacts from './pages/Contacts';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import './index.css'
import AddNewContact from './pages/AddNewContact';
import ViewContact from './pages/ViewContact';
import UpdateContact from './pages/UpdateContact';


function App() {
  return (
    <div className="app-layout-container"> 
      <nav className="app-nav-bar"> 
        <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
         
          <li style={{ display: 'inline' }}>
            <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>
              Contact
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main area that contains the routes for pages */}
      <main className="main-route-wrapper"> 
        <Routes>
          
          <Route path="/" element={<Login />} />{/*  Main landing page */}
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/contact" element={<Contacts />} /> 
          <Route path="/add-contact" element={<AddNewContact />} />
          <Route path='/view-contact/:id' element={<ViewContact />} />
          <Route path='/edit-contact/:id' element={<UpdateContact />}/>

          <Route path="*" element={<h1 className="full-height-page" style={{ color: 'white' }}>404: Page Not Found</h1>} />
        </Routes>
      </main>
    </div>
  )
}

export default App;