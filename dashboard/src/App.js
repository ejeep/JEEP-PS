import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import Login from "./pages/Login"; // Import the Login page
import Main from "./pages/Main"; // Import Main.js
import AdminDashboard from "./pages/AdminDashboard";
import Travels from "./pages/Travels";
import Drivers from "./pages/Drivers";
import Jeeps from "./pages/Jeeps";
import Reports from "./pages/Reports";
import About from "./pages/About"; // Import About page
import Account from "./pages/Account"; // Import Account page
import Schedule from "./pages/Schedule";
import JeepDataPage from "./pages/JeepDataPage";
import TravelLogs from "./pages/TravelLogs";
import { NotificationProvider } from "./pages/Notification";

import "leaflet/dist/leaflet.css";
import "./App.css"; // Add styles for main layout
import AdminSettings from "./pages/AdminSettings";

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          {/* Route for Login */}
          <Route path="/login" element={<Login />} />

          {/* Load Main as the default page */}
          <Route path="/" element={<Main />} />

          {/* Routes for About and Account */}
          <Route path="/about" element={<About />} />
          <Route path="/account" element={<Account />} />

          {/* Main layout with Sidebar and Main content for Admin */}
          <Route
            path="*"
            element={
              <div className="app-layout">
                <Sidebar />
                <div className="main-content">
                  <Routes>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/travels" element={<Travels />} />
                    <Route path="/drivers" element={<Drivers />} />
                    <Route path="/jeeps" element={<Jeeps />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/jeep-tracker" element={<JeepDataPage />} />
                    <Route path="/travel-logs" element={<TravelLogs />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/adminsettings" element={<AdminSettings />} />
                  </Routes>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
