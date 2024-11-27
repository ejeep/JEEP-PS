// src/components/LogoutModal.js
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

function LogoutModal({ isOpen, onConfirm, onClose }) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="logout-modal-title"
      aria-describedby="logout-modal-description"
    >
      <DialogTitle id="logout-modal-title">Confirm Logout</DialogTitle>
      <DialogContent>
        <DialogContentText id="logout-modal-description">
          Are you sure you want to log out?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          style={{
            width: "48%",
            backgroundColor: "#fff", // Green background
            color: "#4CAF50",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          style={{
            width: "48%",
            backgroundColor: "#4CAF50", // Green background
            color: "#fff",
          }}
          variant="contained"
        >
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LogoutModal;
