import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Button,
  Badge,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
} from "@mui/material";
import { Notifications } from "@mui/icons-material";
import axios from "axios";
import "./Reports.css";

function Reports({ setHasNotification }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [failCount, setFailCount] = useState(0);  // Track failed attempts
  const [openSnackbar, setOpenSnackbar] = useState(false);  // For Snackbar visibility
  const [anchorEl, setAnchorEl] = useState(null);  // For Popover (notification dropdown)
  const [notifications, setNotifications] = useState([]); // Store notifications

  // Fetch the data from the backend API when the component is mounted
  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const response = await axios.get("https://jeep-ps.onrender.com/gps/locations");
        setReports(response.data); // Set the fetched data into the reports state
        setLoading(false);
        setFailCount(0); // Reset the fail count on success
      } catch (error) {
        setError("Failed to load vehicle data.");
        setLoading(false);
        setFailCount(prevCount => prevCount + 1); // Increment the fail count

        // If we reach 3 failed attempts, show a notification
        if (failCount + 1 === 3) {
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            "No location received 3 times! Please check the GPS connection.",
          ]);
          setOpenSnackbar(true);
        }
      }
    };

    fetchReportsData();
  }, [failCount, setHasNotification]); // Depend on failCount to keep track of failures

  // Styling for status colors based on the vehicle status
  const getStatusColor = (status) => {
    switch (status) {
      case "good":
        return "green";
      case "breakdown":
        return "red";
      default:
        return "grey";
    }
  };

  const handleGenerateReport = () => {
    console.log("Report Generated");
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);  // Close the Snackbar when clicked
  };

  const handleClickNotification = (event) => {
    setAnchorEl(event.currentTarget); // Open Popover on bell click
  };

  const handleClosePopover = () => {
    setAnchorEl(null); // Close Popover
  };

  const open = Boolean(anchorEl);  // Check if Popover is open

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" align="center" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        Vehicle Reports
      </Typography>

      {/* Notification Bell Icon */}
      <IconButton
        onClick={handleClickNotification}
        sx={{ position: "absolute", top: 16, right: 16 }}
      >
        <Badge
          badgeContent={notifications.length} // Display number of unread notifications
          color="error"
        >
          <Notifications />
        </Badge>
      </IconButton>

      {/* Popover for Notifications */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Paper sx={{ width: 250, padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <List>
            {notifications.map((notification, index) => (
              <ListItem key={index}>
                <ListItemText primary={notification} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Popover>

      <TableContainer component={Paper} className="table-container">
        <Table sx={{ minWidth: 650 }} aria-label="vehicle management table">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Vehicle</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Seat Availability
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Route Direction</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Condition</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report, index) => (
              <TableRow key={index} hover>
                <TableCell>{report.arduinoID}</TableCell>
                <TableCell>{report.status}</TableCell>
                <TableCell>{report.seatAvailability}</TableCell>
                <TableCell>{report.direction}</TableCell>
                <TableCell
                  sx={{
                    color: getStatusColor(report.condition),
                    fontWeight: "bold",
                  }}
                >
                  <Badge
                    color={
                      report.condition === "good"
                        ? "success"
                        : report.condition === "breakdown"
                        ? "danger"
                        : "error"
                    }
                    variant="dot"
                    overlap="rectangular"
                    sx={{ mr: 1 }}
                  />
                  {report.condition}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar to show the notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="warning">
          No location received 3 times! Please check the GPS connection.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Reports;

