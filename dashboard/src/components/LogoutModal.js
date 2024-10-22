import React from "react";
import "./LogoutModal.css";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null; // Don't render if the modal is not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to logout?</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-button">
            Yes
          </button>
          <button onClick={onClose} className="cancel-button">
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
