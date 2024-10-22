// src/pages/Topbar.js
import React, { useState } from 'react';
import './Topbar.css';

function Topbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleTopbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`topbar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="topbar-header">
        <div className="toggle-icon" onClick={toggleTopbar}>
          {/* You can add an icon for toggling if needed */}
        </div>
        <h1 className="topbar-title">JEEP TRACKING SYSTEM</h1>
      </div>
    </div>
  );
}

export default Topbar;
