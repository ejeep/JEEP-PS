import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import "./Settings.css";

function Settings() {
  const [username, setUsername] = useState("Admin");
  const [email, setEmail] = useState("admin@example.com");
  const [role, setRole] = useState("Administrator");
  const [dateJoined, setDateJoined] = useState("January 1, 2021");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("0905-123-4567");
  const [language, setLanguage] = useState("English");

  const [openModal, setOpenModal] = useState(false); // Modal open/close state

  const handleSaveSettings = () => {
    if (password && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setOpenModal(true); // Open modal on save
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Close modal
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Paper className="settings-container">
        <Grid container spacing={2} alignItems="center">
          {/* Avatar and Header */}
          <Grid item xs={12} className="settings-header">
            <Avatar className="admin-avatar">A</Avatar>
            <Box ml={2}>
              <Typography variant="h5" className="settings-title">
                Account Settings
              </Typography>
              <Typography variant="subtitle1" className="settings-subtitle">
                Administrator
              </Typography>
            </Box>
          </Grid>

          {/* Username Field */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="input-label">
              Username
            </Typography>
            <TextField
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: <EditIcon className="edit-icon" />,
              }}
            />
          </Grid>

          {/* Email Field */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="input-label">
              E-mail
            </Typography>
            <TextField
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: <EditIcon className="edit-icon" />,
              }}
            />
          </Grid>

          {/* Role Field */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="input-label">
              Role
            </Typography>
            <TextField
              variant="outlined"
              value={role}
              disabled
              fullWidth
              InputProps={{
                endAdornment: <EditIcon className="edit-icon" />,
              }}
            />
          </Grid>

          {/* Date Joined Field */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="input-label">
              Date Joined
            </Typography>
            <TextField
              variant="outlined"
              value={dateJoined}
              disabled
              fullWidth
              InputProps={{
                endAdornment: <EditIcon className="edit-icon" />,
              }}
            />
          </Grid>

          {/* Phone Number Field */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="input-label">
              Phone Number
            </Typography>
            <TextField
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: <EditIcon className="edit-icon" />,
              }}
            />
          </Grid>

          {/* Language Field */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="input-label">
              Language
            </Typography>
            <TextField
              variant="outlined"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: <EditIcon className="edit-icon" />,
              }}
            />
          </Grid>

          {/* Password Field */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="input-label">
              Password
            </Typography>
            <TextField
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              placeholder="Enter new password"
            />
          </Grid>

          {/* Confirm Password Field */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="input-label">
              Confirm Password
            </Typography>
            <TextField
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              placeholder="Confirm new password"
            />
          </Grid>

          {/* Save and Cancel Buttons */}
          <Grid item xs={12} className="settings-actions">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveSettings}
              className="save-button"
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              className="cancel-button"
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Modal Dialog for Settings Saved */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="settings-saved-dialog"
      >
        <DialogTitle id="settings-saved-dialog">
          Settings Saved
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{ position: "absolute", right: 8, top: 8, color: "#888" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your account settings have been successfully updated.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Settings;
