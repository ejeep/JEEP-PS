import React, { useState } from "react";
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./Reports.css";

const initialReportData = [
  {
    vehicle: "Jeepney",
    status: "Okay",
    seatAvailability: "Available Seats",
    routeDirection: "North Bound",
    isRead: false,
  },
  {
    vehicle: "Bus",
    status: "Under Maintenance",
    seatAvailability: "Full",
    routeDirection: "South Bound",
    isRead: true,
  },
  // Add more data as needed...
];

function Reports() {
  const [reports, setReports] = useState(initialReportData);

  const toggleReadStatus = (index) => {
    const updatedReports = reports.map((report, i) =>
      i === index ? { ...report, isRead: !report.isRead } : report
    );
    setReports(updatedReports);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Manage Vehicles
      </Typography>
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vehicle</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Seat Availability</TableCell>
              <TableCell>Route Direction</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report, index) => (
              <TableRow key={index}>
                <TableCell>{report.vehicle}</TableCell>
                <TableCell>{report.status}</TableCell>
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
    </Box>
  );
}

export default Reports;
