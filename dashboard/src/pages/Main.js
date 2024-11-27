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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMap, setViewMap] = useState(false); // Toggle between views
  const [commuterLocation, setCommuterLocation] = useState(null);
  const [selectedJeep, setSelectedJeep] = useState(null);
  const navigate = useNavigate();

  // Fetch jeep data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jeepsResponse = await axios.get("http://localhost:3004/jeep-data/jeeps");
        setJeeps(jeepsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();
    getCommuterLocation(); // Get commuter location on component mount
  }, []);

  // Function to get commuter's location
  const getCommuterLocation = debounce(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
  
          console.log("Sending location:", {
            commuterLocation: { latitude, longitude }
          });
  
          try {
            const response = await axios.post("http://localhost:3004/gps/commuter-location", {
              commuterLocation: { latitude, longitude }
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
  }, 60000);

  // Handle click on a jeep marker
  const handleJeepClick = (jeep) => {
    setSelectedJeep(jeep);
  };

  // Render jeeps in table based on direction
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

  if (loading) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" align="center" color="error">{error}</Typography>;
  }

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
                  <Typography>Jeep ID: {selectedJeep.jeepID}</Typography>
                  <Typography>Available Seats: {selectedJeep.seatAvailability}</Typography>
                  <Typography>Status: {selectedJeep.status}</Typography>
                  <Typography>Direction: {selectedJeep.direction}</Typography>
                  <Typography>Condition: {selectedJeep.condition}</Typography>
                  <Typography>
                    Last Updated: {new Date(selectedJeep.timestamp).toLocaleString()}
                  </Typography>
                </>
              ) : (
                <Typography>Select a marker to view jeep details.</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <MapContainer
              center={commuterLocation || [16.4939, 121.1128]}
              zoom={13}
              style={{ height: "475px", width: "100%", borderRadius: "12px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {commuterLocation && (
                <Marker position={commuterLocation}>
                  <Popup>Your Location</Popup>
                </Marker>
              )}
              {jeeps.map((jeep, index) => (
                <Marker
                  key={index}
                  position={[jeep.jeepLocation.lat, jeep.jeepLocation.lng]}
                  eventHandlers={{
                    click: () => handleJeepClick(jeep),
                  }}
                >
                  <Popup>
                    <Typography><strong>Jeep ID:</strong> {jeep.jeepID}</Typography>
                    <Typography><strong>Status:</strong> {jeep.status}</Typography>
                  </Popup>
                </Marker>
              ))}
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
