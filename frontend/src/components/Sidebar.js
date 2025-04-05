import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        window.location.replace("/login");
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <aside className="sidebar">
            <ul>
                <h2 className="logo">Super Shoppy</h2>
                <Link to="/"><li>Dashboard</li></Link>
                <Link to="/invoices/create"><li>Create Invoice</li></Link>
                <Link to="/products"><li>Manage Products</li></Link>

                <li onClick={toggleDropdown}>
                    Reports ▾
                    {showDropdown && (
                        <ul className="dropdown">
                            <Link to="/sales-report"><li>Sales Report</li></Link>
                            <Link to="/profit-loss"><li>Profit & Loss Report</li></Link>
                        </ul>
                    )}
                </li>

                <Link to="/invoices"><li>View Invoices</li></Link>
                <Link to="/productForm"><li>Add Stock</li></Link>
                <li>
                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                        style={{
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Logout
                    </button>

                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
