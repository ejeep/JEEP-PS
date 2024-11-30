import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Table,
  Button,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

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
  const [error, setError] = useState(null);
  const [tabIndex, setTabIndex] = useState(0); // For tabs
  const [commuterLocation, setCommuterLocation] = useState(null);
  const [jeepLocations, setJeepLocations] = useState([]);
  const [selectedJeep, setSelectedJeep] = useState(null);
  const [etaData, setEtaData] = useState([]); // New state for ETA data
  const navigate = useNavigate();

  const fetchJeepLocations = async () => {
    try {
      const response = await axios.get("http://localhost:3004/gps/locations");
      setJeepLocations(response.data);
    } catch (error) {
      console.error("Error fetching jeep locations:", error);
    }
  };

  const fetchEta = async () => {
    try {
      const response = await axios.get("http://localhost:3004/gps/eta");
      setEtaData(response.data); // Store the ETA data
    } catch (error) {
      console.error("Error fetching ETA data:", error);
    }
  };

  useEffect(() => {
    fetchJeepLocations();
    getCurrentLocation();
    fetchData();
    fetchEta(); // Fetch ETA data on component mount

    const interval = setInterval(() => {
      if (commuterLocation) {
        updateCommuterLocation(commuterLocation);
      }
    }, 300000); // 300,000ms = 5 minutes
  
    return () => clearInterval(interval);
  }, [commuterLocation]);

  const fetchData = async () => {
    try {
      const jeepsResponse = await axios.get(
        "http://localhost:3004/jeep-data/jeeps"
      );
      setJeeps(jeepsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data.");
    }
  };

  const handleJeepClick = (jeep) => {
    setSelectedJeep(jeep);
  };

  const filteredJeepLocations = jeepLocations.filter(
    (jeep) => jeep.condition !== "broken" && jeep.condition !== "maintenance"
  );

  const renderJeeps = (direction) =>
    jeeps
      .filter((jeep) => jeep.routeDirection === direction)
      .map((jeep) => (
        <TableRow key={jeep.id}>
          <TableCell>{jeep.plateNumber}</TableCell>
          <TableCell>{jeep.routeDirection}</TableCell>
          <TableCell>{jeep.status}</TableCell>
          <TableCell>{jeep.timeSchedule}</TableCell>
        </TableRow>
      ));


      const updateCommuterLocation = async (location) => {
        try {
          await axios.put("http://localhost:3004/gps/commuter-location", location);
          console.log("Commuter location updated successfully");
        } catch (error) {
          console.error("Error updating commuter location:", error);
        }
      };

      const getCurrentLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const location = { latitude, longitude };
              setCommuterLocation(location);
      
              // Immediately send the location to the server
              updateCommuterLocation(location);
            },
            (error) => {
              console.error("Error getting location:", error);
              setError("Failed to get commuter location.");
            }
          );
        } else {
          setError("Geolocation is not supported by this browser.");
        }
      };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Function to get ETA for a specific jeep by ID or Route Direction
  const getJeepEta = (arduinoID) => {
    const eta = etaData.find((eta) => eta.arduinoID === arduinoID); // Assuming 'jeepId' is the identifier in ETA data
    return eta ? eta.estimatedArrivalTime : "ETA not available";
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        {tabIndex === 0
          ? "Travel Display Information"
          : "Jeep Information and Map"}
      </Typography>

      <LoginButton variant="outlined" onClick={() => navigate("/login")}>
        Login
      </LoginButton>

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        centered
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Travel Display" />
        <Tab label="Jeep Map" />
      </Tabs>

      {/* Tab Content */}
      {tabIndex === 0 && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" align="center" gutterBottom>
              North Bound
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Plate Number</TableCell>
                    <TableCell>Route Direction</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Departure Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{renderJeeps("North Bound")}</TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" align="center" gutterBottom>
              South Bound
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Plate Number</TableCell>
                    <TableCell>Route Direction</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Departure Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{renderJeeps("South Bound")}</TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}

      {tabIndex === 1 && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Box p={2} border={1} borderRadius={2}>
              <Typography variant="h6" gutterBottom>
                Jeep Information
              </Typography>
              {selectedJeep ? (
                <>
                  <Typography>Jeep ID: {selectedJeep.arduinoID}</Typography>
                  <Typography>
                    Available Seats: {selectedJeep.seatAvailability}
                  </Typography>
                  <Typography>Status: {selectedJeep.status}</Typography>
                  <Typography>Direction: {selectedJeep.direction}</Typography>
                  <Typography>Condition: {selectedJeep.condition}</Typography>
                  <Typography>
                    Last Updated:{" "}
                    {new Date(selectedJeep.timestamp).toLocaleString()}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Estimated Arrival Time: {getJeepEta(selectedJeep.arduinoID)}{" "}
                    {/* Display ETA here */}
                  </Typography>
                </>
              ) : (
                <Typography>Select a marker to view jeep details.</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <MapContainer
              center={
                commuterLocation
                  ? [commuterLocation.latitude, commuterLocation.longitude]
                  : [16.4939, 121.1128]
              }
              zoom={13}
              style={{
                height: "475px",
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {filteredJeepLocations.map((jeep, index) => (
                <Marker
                  key={index}
                  position={[jeep.jeepLocation.lat, jeep.jeepLocation.lng]}
                  eventHandlers={{
                    click: () => handleJeepClick(jeep),
                  }}
                >
                  <Popup>
                    <Box p={2}>
                    <Typography variant="subtitle1">
                        <strong>Jeep ID:</strong> {jeep.arduinoID}
                      </Typography>
                      <Typography variant="subtitle2">
                        <strong>Available Seats:</strong>{" "}
                        {jeep.seatAvailability}
                      </Typography>
                      <Typography variant="subtitle2">
                        <strong>Status:</strong> {jeep.status}
                      </Typography>
                      <Typography variant="subtitle2">
                        <strong>Direction:</strong> {jeep.direction}
                      </Typography>
                      <Typography variant="subtitle2">
                        <strong>Condition:</strong> {jeep.condition}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Estimated Arrival Time: {getJeepEta(jeep.arduinoID)}{" "}
                        {/* Display ETA here */}
                      </Typography>
                    </Box>
                  </Popup>
                </Marker>
              ))}

              {commuterLocation && (
                <Marker
                  position={[
                    commuterLocation.latitude,
                    commuterLocation.longitude,
                  ]}
                >
                  <Popup>
                    <Typography variant="subtitle1">
                      <strong>Commuter Location</strong>
                    </Typography>
                    <Typography variant="body2">Your location</Typography>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default Main;
