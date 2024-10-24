// src/pages/Travel.js
import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import axios from "axios";
import './Travels.css'; // Import the CSS file for additional styling

function Travel() {
  const [jeeps, setJeeps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jeep data from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jeepsResponse = await axios.get("http://localhost:3004/jeep-data/jeeps");

        // Set jeeps data with relevant fields (plate number, direction, status)
        setJeeps(jeepsResponse.data.map((jeep) => ({
          id: jeep.id,
          plateNumber: jeep.plateNumber,
          routeDirection: jeep.routeDirection,
          status: jeep.status || "Waiting" // Default status to "Waiting" if not set
        })));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render the jeeps based on their direction (North/South Bound)
  const renderJeeps = (direction) =>
    jeeps
      .filter((jeep) => jeep.routeDirection === direction)
      .map((jeep, index) => (
        <TableRow key={jeep.id}>
          <TableCell>{jeep.plateNumber}</TableCell>
          <TableCell>{jeep.routeDirection}</TableCell>
          <TableCell>{jeep.status}</TableCell>
        </TableRow>
      ));

  if (loading) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" align="center" color="error">{error}</Typography>;
  }

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
                  <TableCell style={{ color: "#fff" }}>Plate Number</TableCell>
                  <TableCell style={{ color: "#fff" }}>Route Direction</TableCell>
                  <TableCell style={{ color: "#fff" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renderJeeps("North Bound")}
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
                  <TableCell style={{ color: "#fff" }}>Plate Number</TableCell>
                  <TableCell style={{ color: "#fff" }}>Route Direction</TableCell>
                  <TableCell style={{ color: "#fff" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renderJeeps("South Bound")}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Travel;
