import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import Login from "./pages/Login";  // Import the Login page
import Main from "./pages/Main"; // Import Main.js
import AdminDashboard from "./pages/AdminDashboard";
import Travels from "./pages/Travels";
import Clients from "./pages/Clients";
import Drivers from "./pages/Drivers";
import Jeeps from "./pages/Jeeps";
import Status from "./pages/Status";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Commuter from "./pages/Commuter";
import About from "./pages/About";  // Import About page
import Account from "./pages/Account"; // Import Account page
import './App.css'; // Add styles for main layout

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Login */}
        <Route path="/login" element={<Login />} />

        {/* Load Main as the default page */}
        <Route path="/" element={<Main />} />
        <Route path="/commuter" element={<Commuter />} />

        {/* Routes for About and Account */}
        <Route path="/about" element={<About />} /> {/* Add About page route */}
        <Route path="/account" element={<Account />} /> {/* Add Account page route */}

        {/* Main layout with Sidebar and Main content for Admin*/}
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
