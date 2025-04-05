// Navbar Component
import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.replace("/login"); // Hard redirect to remove previous history
};


  
  return (
    <nav className="navbar">
      <h2 style={{color:"red"}} className="logo">Super Shoppy</h2>
      <ul className="nav-links">
        <li><Link to="/productForm">Add Stock</Link></li>
        <li><Link to="/invoices">Invoices</Link></li>
        <li>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;