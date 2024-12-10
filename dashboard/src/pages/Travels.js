import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import "./Travels.css";

function Travel() {
  const [jeeps, setJeeps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jeep data from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3004/gps/locations");

        // Set jeeps data with relevant fields (plateNumber, direction, status)
        setJeeps(
          response.data.map((jeep) => ({
            id: jeep.arduinoID, // Assuming `_id` is the unique identifier
            plateNumber: jeep.plateNumber,
            direction: jeep.direction,
            status: jeep.status || "Waiting", // Default status to "Waiting" if not set
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render jeeps based on their direction
  const renderJeeps = (direction) =>
    jeeps
      .filter((jeep) => jeep.direction.toLowerCase() === direction.toLowerCase())
      .map((jeep) => (
        <TableRow key={jeep.id}>
          <TableCell>{jeep.plateNumber}</TableCell>
          <TableCell>{jeep.direction}</TableCell>
          <TableCell>{jeep.status}</TableCell>
        </TableRow>
      ));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Travel Display Information
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{ backgroundColor: "#4CAF50", color: "#fff", padding: 1, borderRadius: "4px" }}
          >
            North Bound
          </Typography>
          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#3E8E41", color: "#fff" }}>
                  <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Plate Number</TableCell>
                  <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Direction</TableCell>
                  <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderJeeps("north bound")}</TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{ backgroundColor: "#4CAF50", color: "#fff", padding: 1, borderRadius: "4px" }}
          >
            South Bound
          </Typography>
          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#3E8E41", color: "#fff" }}>
                  <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Plate Number</TableCell>
                  <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Direction</TableCell>
                  <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderJeeps("south bound")}</TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Travel;
