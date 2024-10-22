// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Travels from "./pages/Travels";
import Clients from "./pages/Clients";
import Drivers from "./pages/Drivers";
import Jeeps from "./pages/Jeeps";
import Status from "./pages/Status";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import './App.css'; // Add styles for main layout

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Main layout with Sidebar and Main content */}
        <Route
          path="*"
          element={
            <div className="app-layout">
              <Sidebar />
              <div className="main-content">
                <Routes>
                  <Route path="/dashboard" element={<AdminDashboard />} />
                  <Route path="/travels" element={<Travels />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/drivers" element={<Drivers />} />
                  <Route path="/jeeps" element={<Jeeps />} />
                  <Route path="/status" element={<Status />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;