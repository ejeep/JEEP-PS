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
  Switch,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import debounce from "lodash.debounce";
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
  const [viewMap, setViewMap] = useState(false); // Toggle between views
  const [commuterLocation, setCommuterLocation] = useState(null);
  const [jeepLocations, setJeepLocations] = useState([]);
  const [selectedJeep, setSelectedJeep] = useState(null);
  const navigate = useNavigate();

  const fetchJeepLocations = async () => {
    try {
      const response = await axios.get("http://localhost:3004/gps/locations");
      setJeepLocations(response.data); // Assuming the API returns an array of jeep location data
    } catch (error) {
      console.error("Error fetching jeep locations:", error);
    }
  };

  useEffect(() => {
    fetchJeepLocations();
    fetchData();

    // Optionally, poll the API every few seconds for real-time updates
    const interval = setInterval(fetchJeepLocations, 600000); // Update every 10 minutes
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

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

  // Get current location using geolocation API
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

  // Call getCurrentLocation when the component mounts
  useEffect(() => {
    getCurrentLocation();
  }, []);


  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        {viewMap ? "Jeep Information and Map" : "Travel Display Information"}
      </Typography>

      <LoginButton variant="outlined" onClick={() => navigate("/login")}>
        Login
      </LoginButton>

      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
        <Typography>Travel Display</Typography>
        <Switch
          checked={viewMap}
          onChange={() => setViewMap(!viewMap)}
          color="primary"
        />
        <Typography>Jeep Map</Typography>
      </Box>

      {viewMap ? (
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
                </>
              ) : (
                <Typography>Select a marker to view jeep details.</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <MapContainer
              center={commuterLocation ? [commuterLocation.latitude, commuterLocation.longitude] : [16.4939, 121.1128]}
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
                        <strong>Condition:</strong> {jeep.condition}
                      </Typography>
                      <Typography variant="caption">
                        <strong>Last Updated:</strong>{" "}
                        {new Date(jeep.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  </Popup>
                </Marker>
              ))}

              {/* Add commuter location marker if available */}
              {commuterLocation && (
                <Marker
                  position={[commuterLocation.latitude, commuterLocation.longitude]}
                >
                  <Popup>
                    <Typography variant="subtitle1">
                      <strong>Commuter Location</strong>
                    </Typography>
                    <Typography variant="body2">
                     Your location
                    </Typography>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </Grid>
        </Grid>
      ) : (
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
    </Box>
  );
}

export default Main;
