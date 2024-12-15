import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  Dashboard,
  DirectionsCar,
  Commute,
  Report,
  Settings,
  Logout,
  TripOrigin,
  DepartureBoard,
} from "@mui/icons-material";
import "./Sidebar.css";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import LogoutModal from "../components/LogoutModal";
import HistoryIcon from "@mui/icons-material/History";
import { useNotification } from "./Notification";

function Sidebar({ hasNotification }) {
  const [isOpen, setIsOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const { notificationDots } = useNotification();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const closeModal = () => {
    setShowLogoutModal(false);
  };

  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        <div className="toggle-icon" onClick={toggleSidebar}>
          <Menu />
        </div>
        <div className="logo">
          {isOpen ? (
            <h2>JEEP-PS</h2>
          ) : (
            <img src="/logo.png" alt="Logo" className="sidebar-logo" />
          )}
        </div>
      </div>

      <div className="sidebar-menu">
        <ul>
          <li>
            <Link to="/dashboard">
              <Dashboard />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/travels">
              <TripOrigin />
              <span>Travels</span>
            </Link>
          </li>
          <li>
            <Link to="/drivers">
              <DirectionsCar />
              <span>
                Driver {/* Always display the "Driver" text */}
                {notificationDots.driver && (
                  <span
                    style={{
                      display: "inline-block",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      marginLeft: "5px",
                    }}
                  ></span>
                )}
              </span>
            </Link>
          </li>

          <li>
            <Link to="/jeeps">
              <Commute />
              <span>Jeeps</span>
            </Link>
          </li>
          <li>
            <Link to="/schedule">
              <DepartureBoard />
              <span>Schedule</span>
            </Link>
          </li>
          <li>
            <Link to="/jeep-tracker">
              <LocationSearchingIcon />
              <span>Jeep Tracker</span>
            </Link>
          </li>
          <li>
            <Link to="/travel-logs">
              <HistoryIcon />
              <span>Travel Logs</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <ul>
          <li>
            <Link to="/reports">
              <Report />
              <span>Reports</span>
              {hasNotification && (
                <span className="notification-badge">!</span> // Notification badge
              )}
            </Link>
          </li>
          <li>
            <Link to="/adminsettings">
              <Settings />
              <span>Settings</span>
            </Link>
          </li>
          <li onClick={handleLogout}>
            <Logout />
            {isOpen && <span>Logout</span>}
          </li>
        </ul>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onClose={closeModal}
      />
    </div>
  );
}

export default Sidebar;
