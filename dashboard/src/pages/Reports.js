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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
        const response = await axios.get("http://localhost:3004/vehicle-data"); // Replace with your actual API endpoint
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography variant="h6" align="center" color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
        Vehicle Management Reports
      </Typography>

      <TableContainer component={Paper} className="table-container">
        <Table sx={{ minWidth: 650 }} aria-label="vehicle management table">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Vehicle</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Seat Availability</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Route Direction</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report, index) => (
              <TableRow key={index} hover>
                <TableCell>{report.vehicle}</TableCell>
                <TableCell sx={{ color: getStatusColor(report.status), fontWeight: "bold" }}>
                  {report.status}
                </TableCell>
                <TableCell>{report.seatAvailability}</TableCell>
                <TableCell>{report.routeDirection}</TableCell>
                <TableCell>
                  <IconButton
                    color={report.isRead ? "secondary" : "primary"}
                    onClick={() => toggleReadStatus(index)}
                  >
                    {report.isRead ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Button variant="contained" color="primary" sx={{ fontWeight: "bold" }}>
          Generate Report
        </Button>
      </Box>
    </Box>
  );
}

export default Reports;
