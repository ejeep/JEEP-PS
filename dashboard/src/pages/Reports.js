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
} from "@mui/material";
import { Visibility, VisibilityOff, FileDownload } from "@mui/icons-material";
import axios from "axios";
import "./Reports.css";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the data from the backend API when the component is mounted
  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const response = await axios.get("http://localhost:3004/gps/locations"); // Replace with your actual API endpoint
        setReports(response.data); // Set the fetched data into the reports state
        setLoading(false);
      } catch (error) {
        setError("Failed to load vehicle data.");
        setLoading(false);
      }
    };

    fetchReportsData();
  }, []);

  // Function to toggle the read status of a report
  const toggleReadStatus = (index) => {
    const updatedReports = reports.map((report, i) =>
      i === index ? { ...report, isRead: !report.isRead } : report
    );
    setReports(updatedReports);
  };

  // Styling for status colors based on the vehicle status
  const getStatusColor = (status) => {
    switch (status) {
      case "Okay":
        return "green";
      case "Under Maintenance":
        return "orange";
      case "Unavailable":
        return "red";
      default:
        return "grey";
    }
  };

  const handleGenerateReport = () => {
    // Implement your report generation logic here (e.g., download as CSV/PDF)
    console.log("Report Generated");
  };

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
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        Vehicle Management Reports
      </Typography>

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
                <TableCell>{report.jeepID}</TableCell>
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
                        : report.condition === "maintenance"
                        ? "warning"
                        : report.condition === "broken" 
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
    </Box>
  );
}

export default Reports;
