// src/pages/Travel.js
import React from "react";
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import './Travels.css'; // Import the CSS file for additional styling

const northBoundData = [
  { busNo: 101, destination: "Bayombong", status: "On the Road" },
  { busNo: 102, destination: "Solano", status: "On the Road" },
];

const southBoundData = [
  { busNo: 201, destination: "Kasibu", status: "On the Road" },
  { busNo: 202, destination: "Quezon", status: "On the Road" },
];

function Travel() {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Travel Display Information
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h6" align="center" gutterBottom>
            North Bound
          </Typography>
          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#4CAF50", color: "#fff" }}>
                  <TableCell style={{ color: "#fff" }}>Bus No.</TableCell>
                  <TableCell style={{ color: "#fff" }}>Destination</TableCell>
                  <TableCell style={{ color: "#fff" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {northBoundData.map((row) => (
                  <TableRow key={row.busNo}>
                    <TableCell>{row.busNo}</TableCell>
                    <TableCell>{row.destination}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" align="center" gutterBottom>
            South Bound
          </Typography>
          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#4CAF50", color: "#fff" }}>
                  <TableCell style={{ color: "#fff" }}>Bus No.</TableCell>
                  <TableCell style={{ color: "#fff" }}>Destination</TableCell>
                  <TableCell style={{ color: "#fff" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {southBoundData.map((row) => (
                  <TableRow key={row.busNo}>
                    <TableCell>{row.busNo}</TableCell>
                    <TableCell>{row.destination}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Travel;
