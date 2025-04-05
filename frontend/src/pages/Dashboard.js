import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import SalesReport from "../components/SalesReport";
import ProductStats from "../Stats/ProductStats";
import ProfitLoss from "../Stats/ProfitLoss";
import "./Dashboard.css";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-container">
      {/* Sidebar Toggle Button for Mobile */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      > 
        ☰
      </button>

      <div className="dashboard-layout">
        <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
          <Sidebar />
        </div>

        <main className="dashboard-content">
          <div className="stats-container">
            <ProductStats />
            <ProfitLoss />
          </div>
          <SalesReport />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
