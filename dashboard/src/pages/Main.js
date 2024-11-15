// src/pages/Travel.js
import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, Table, Button, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Travels.css'; // Import the CSS file for additional styling

const LoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#ffffff",
  color: "#28a745",
  position: "absolute",
  top: "20px",
  right: "20px",
  zIndex: 1000,
  padding: theme.spacing(1.5, 3),
  borderRadius: "20px",
  fontWeight: "bold",
  [theme.breakpoints.down("sm")]: {
    bottom: "20px",
    right: "50%",
    transform: "translateX(50%)",
    width: "90%",
  },
}));

function Main() {
  const [jeeps, setJeeps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    getCommuterLocation(); // Call to get commuter location
  }, []);

  // Function to get commuter's location
  const getCommuterLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
  
          console.log("Sending location:", {
            commuterLocation: {
              latitude: latitude,
              longitude: longitude,
            }
          });
  
          try {
            const response = await axios.post("http://localhost:3004/gps/commuter-location", {
              commuterLocation: {
                latitude: latitude,
                longitude: longitude,
              }
            });
  
            console.log("Response from server:", response.data); // Log the server response
            setError(null); // Reset error state on successful request
          } catch (error) {
            console.error("Error sending location:", error.response ? error.response.data : error.message);
            setError("Failed to send your location."); // Update error message
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to retrieve your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };
  
  
  

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
      <LoginButton variant="outlined" onClick={() => navigate("/login")}>
        Login
      </LoginButton>
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
                  <TableCell style={{ color: "#fff" }}>Departure Time</TableCell>
                  <TableCell style={{ color: "#fff" }}>Route Direction</TableCell>
                  <TableCell style={{ color: "#fff" }}>Status</TableCell>
                  <TableCell style={{ color: "#fff" }}>ETA</TableCell>
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
                  <TableCell style={{ color: "#fff" }}>Departure Time</TableCell>
                  <TableCell style={{ color: "#fff" }}>Route Direction</TableCell>
                  <TableCell style={{ color: "#fff" }}>Status</TableCell>
                  <TableCell style={{ color: "#fff" }}>ETA</TableCell>
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

export default Main;
