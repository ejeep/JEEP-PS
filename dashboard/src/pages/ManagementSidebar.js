import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTachometerAlt,
  FaBusAlt,
  FaExclamationCircle,
  FaCogs,
  FaSignOutAlt,
} from "react-icons/fa";
import "./ManagementSidebar.css";

function ManagementSidebar() {
  const location = useLocation(); // Track current route

  const menuItems = [
    { to: "/management/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    { to: "/management/travels", icon: <FaBusAlt />, label: "Travels" },
    { to: "/management/status", icon: <FaBusAlt />, label: "Status" },
    { to: "/management/reports", icon: <FaExclamationCircle />, label: "Reports" },
    { to: "/management/settings", icon: <FaCogs />, label: "Settings" },
    { to: "/login", icon: <FaSignOutAlt />, label: "Logout" },
  ];

  const isActive = (path) => location.pathname === path ? "active" : ""; // Check if the route matches

  return (
    <div className="management-sidebar">
      {/* Header */}
      <div className="management-idebar-header">
        <div className="toggle-icon">
          <FaBars />
        </div>
        <h2>JEEP-PS</h2>
      </div>

      {/* Menu */}
      <div className="management-sidebar-menu">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className={isActive(item.to)}>
              <Link to={item.to}>
                {item.icon} <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ManagementSidebar;
