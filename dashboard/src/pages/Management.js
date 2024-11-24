// src/pages/Management.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import ManagementSidebar from "./ManagementSidebar";
import AdminDashboard from "./AdminDashboard"; // Reuse AdminDashboard for management
import Travels from "./Travels";
import Status from "./Status";
import Reports from "./Reports";
import Settings from "./Settings";
import "./Management.css"; // Add custom styles for the management layout

function Management() {
  return (
    <div className="management-layout">
      <ManagementSidebar />
      <div className="management-content">
        <Routes>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="travels" element={<Travels />} />
          <Route path="status" element={<Status />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          {/* Default route */}
          <Route path="*" element={<AdminDashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default Management;
