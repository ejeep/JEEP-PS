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
  Tabs,
  Tab,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import debounce from "lodash.debounce";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

// Table Cell Styles
const StyledTableCell = styled(TableCell)(({ status }) => {
  const normalizedStatus = status ? status.toLowerCase() : ""; // Safely handle undefined/null
  return {
    color:
      normalizedStatus === "waiting"
        ? "#ffeb3b" // Bright yellow for "waiting"
        : normalizedStatus === "en route"
        ? "#39FF14" // Vivid green for "en route"
        : "#ffffff", // White for other statuses (readable against green background)
    fontFamily: "monospace",
    fontWeight: "bold",
    fontSize: "1rem",
  };
});

// Table Container Styles
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: "#058c42", // Dark green for the table background
  borderRadius: "12px", // Rounded corners
  overflow: "hidden",
}));

// Header with Glowing Text Effect
const GlowingHeader = styled(Typography)(({ theme }) => ({
  color: "#ffffff", // White text for readability
  backgroundColor: "#43a047", // Slightly lighter green for contrast
  padding: "10px",
  borderRadius: "8px", // Rounded corners
  textAlign: "center",
  // Subtle text shadow for glow effect
  textShadow: "0 0 8px rgba(67, 160, 71, 0.8), 0 0 15px rgba(67, 160, 71, 0.6)",
  marginBottom: "5px",
}));

// Main Title Styles with Box Header
const TitleBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#28a745", // A complementary green for the title box
  color: "#ffffff", // White text for good readability
  padding: "20px",
  textAlign: "center",
  textShadow:
    "0 0 10px rgba(56, 142, 60, 0.8), 0 0 20px rgba(56, 142, 60, 0.6)", // Glow effect
  fontWeight: "bold",
  fontSize: "1.8rem",
  borderRadius: "8px",
  marginBottom: "20px",
}));

function Main() {
  const [jeeps, setJeeps] = useState([]);
  const [error, setError] = useState(null);
  const [tabIndex, setTabIndex] = useState(0); // For tabs
  const [commuterLocation, setCommuterLocation] = useState(null);
  const [jeepLocations, setJeepLocations] = useState([]);
  const [selectedJeep, setSelectedJeep] = useState(null);
  const navigate = useNavigate();

  const fetchJeepLocations = async () => {
    try {
      const response = await axios.get("http://localhost:3004/gps/locations");
      setJeepLocations(response.data);
      setJeeps(
        response.data.map((jeep) => ({
          id: jeep.arduinoID, // Assuming `_id` is the unique identifier
          plateNumber: jeep.plateNumber,
          direction: jeep.direction,
          status: jeep.status || "Waiting", // Default status to "Waiting" if not set
          eta: jeep.eta || "Unavailable", // Include ETA or default to "Unavailable"
        }))
      );
    } catch (error) {
      console.error("Error fetching jeep locations:", error);
    }
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key.toLowerCase() === "l") {
        event.preventDefault(); // Prevent default browser behavior
        navigate("/login"); // Navigate to the login page
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  useEffect(() => {
    fetchJeepLocations();
    getCommuterLocation();

    const interval = setInterval(fetchJeepLocations, 120000); // Update every 2 minutes
    return () => clearInterval(interval);
  }, []);

  const getCommuterLocation = debounce(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const commuterPayload = { commuterLocation: { latitude, longitude } }; // Flatten payload

          try {
            const response = await axios.put(
              "http://localhost:3004/gps/commuter-location",
              commuterPayload // Pass the correct payload
            );

            // Log server response for debugging
            console.log("Server response:", response.data);

            // Update local state with commuter location
            setCommuterLocation(commuterPayload.commuterLocation);
            setError(null); // Reset any previous errors
          } catch (error) {
            console.error(
              "Error posting commuter location:",
              error.response ? error.response.data : error.message
            );
            setError("Failed to send your location.");
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
  }, 60000);

  // Ensure commuter location is posted once after the component mounts
  useEffect(() => {
    getCommuterLocation();
  }, []);

  const handleJeepClick = (jeep) => {
    setSelectedJeep(jeep);
  };

  const filteredJeepLocations = jeepLocations.filter(
    (jeep) =>
      jeep.condition !== "broken" &&
      jeep.condition !== "maintenance" &&
      jeep.plateNumber // Ensure plateNumber exists
  );
  

  const renderJeeps = (direction) =>
    jeeps
      .filter(
        (jeep) =>
          jeep.direction.toLowerCase() === direction.toLowerCase() &&
          jeep.plateNumber // Ensure plateNumber exists
      )
      .map((jeep) => (
        <TableRow key={jeep.id}>
          <StyledTableCell>{jeep.plateNumber}</StyledTableCell>
          <StyledTableCell>{jeep.direction}</StyledTableCell>
          <StyledTableCell status={jeep.status}>{jeep.status}</StyledTableCell>
          <StyledTableCell>{jeep.eta}</StyledTableCell>
        </TableRow>
      ));
  

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCommuterLocation({ latitude, longitude });
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

  return (
    <Box sx={{ padding: 4 }}>
      <TitleBox>
        {tabIndex === 0
          ? "Travel Display Information"
          : "Jeep Information and Map"}
      </TitleBox>

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        centered
        textColor="primary"
        indicatorColor="primary"
        sx={{ marginBottom: 4 }}
      >
        <Tab label="Travel Display" />
        <Tab label="Jeep Map" />
      </Tabs>

      {/* Travel Display Tab */}
      {tabIndex === 0 && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <GlowingHeader variant="h5">
              North Bound (Solano - Lagawe)
            </GlowingHeader>
            <StyledTableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Plate Number</StyledTableCell>
                    <StyledTableCell>Route Direction</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>ETA</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{renderJeeps("North Bound")}</TableBody>
              </Table>
            </StyledTableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <GlowingHeader variant="h5">
              South Bound (Lagawe - Solano)
            </GlowingHeader>
            <StyledTableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Plate Number</StyledTableCell>
                    <StyledTableCell>Route Direction</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>ETA</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{renderJeeps("South Bound")}</TableBody>
              </Table>
            </StyledTableContainer>
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
                  <Typography>ETA: {selectedJeep.eta}</Typography>
                  <Typography>
                    Last Updated:{" "}
                    {new Date(selectedJeep.timestamp).toLocaleString()}
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
                    <Box>
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
                        <strong>ETA:</strong> {jeep.eta}
                      </Typography>
                      <Typography variant="caption">
                        <strong>Last Updated:</strong>{" "}
                        {new Date(jeep.timestamp).toLocaleString()}
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
                      <strong>Your Current Location</strong>
                    </Typography>
                    <Typography variant="body2">
                      Latitude: {commuterLocation.latitude.toFixed(5)}
                    </Typography>
                    <Typography variant="body2">
                      Longitude: {commuterLocation.longitude.toFixed(5)}
                    </Typography>
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
