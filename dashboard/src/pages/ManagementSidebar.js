import React from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaTachometerAlt,
  FaBusAlt,
  FaUserAlt,
  FaExclamationCircle,
  FaCogs,
  FaSignOutAlt,
} from "react-icons/fa";
import "./ManagementSidebar.css";

function ManagementSidebar() {
  const menuItems = [
    { to: "/management/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    { to: "/management/travels", icon: <FaBusAlt />, label: "Travels" },
    { to: "/management/drivers", icon: <FaUserAlt />, label: "Drivers" },
    { to: "/management/status", icon: <FaBusAlt />, label: "Status" },
    { to: "/management/reports", icon: <FaExclamationCircle />, label: "Reports" },
  ];

  return (
    <div className="management-sidebar">
      {/* Header */}
      <h2>
        <FaBars /> JEEP-PS
      </h2>

      {/* Menu */}
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link to={item.to}>
              {item.icon} <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="footer">
        <li className="settings">
          <Link to="/management/settings">
            <FaCogs /> <span>Settings</span>
          </Link>
        </li>
        <li>
          <Link to="/login">
            <FaSignOutAlt /> <span>Logout</span>
          </Link>
        </li>
      </div>
    </div>
  );
}

export default ManagementSidebar;
