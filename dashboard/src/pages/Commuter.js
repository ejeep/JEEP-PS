import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Card, Divider, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Ensure to set marker icon correctly
delete L.Icon.Default.prototype._getIconUrl; // Remove default URL method for marker icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'), // High-resolution icon
  iconUrl: require('leaflet/dist/images/marker-icon.png'), // Regular icon
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'), // Shadow for the icon
});

// Mock data for jeep statuses
const mockData = [
  {
    plateNumber: "ABX-1234",
    model: "Star8 Solar Jeepney",
    route: "Bayombong-Solano",
    status: "En route",
    driver: {
      name: "John Doe",
      status: "Driving",
    },
    direction: "North Bound",
    location: { lat: 16.493911, lng: 121.112795 } // Sample coordinates
  },
  {
    plateNumber: "CDE-5678",
    model: "Star8 Solar Jeepney",
    route: "Aritao-Baguio",
    status: "En route",
    driver: {
      name: "Jane Smith",
      status: "Driving",
    },
    direction: "South Bound",
    location: { lat: 16.494000, lng: 121.113000 } // Sample coordinates
  },
];

// Container for the whole dashboard
const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
}));


// Container for the jeep status section
const StatusContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#ffffff",
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
  height: "100%", // Flexible height
  borderRadius: "12px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  overflow: "auto", // Make sure content doesn't overflow
}));

function Commuter() {
  const [selectedJeep, setSelectedJeep] = useState(null);
  const [jeepData, setJeepData] = useState([]);

  // Fetch jeep location data from the backend
  const fetchLocationData = async () => {
    try {
      const response = await fetch('/api/location'); // Adjust this URL as needed
      const data = await response.json();
      setJeepData(data); // Assuming data is in the correct format
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  useEffect(() => {
    fetchLocationData();
  }, []);

  // Handle clicking a jeep marker
  const handleJeepClick = (jeep) => {
    setSelectedJeep(jeep);
  };

  return (
    <DashboardContainer>
      {/* Main content: Jeep Status and Map */}
      <Grid container spacing={2} sx={{ marginTop: 4 }}>
        <Grid item xs={12} md={3}>
          {/* Jeep Status Section */}
          <StatusContainer>
            <Typography variant="h6">Jeep Status</Typography>
            {selectedJeep ? (
              <Box>
                <Typography variant="h6">Plate: {selectedJeep.plateNumber}</Typography>
                <Typography>Model: {selectedJeep.model}</Typography>
                <Typography>Route: {selectedJeep.route}</Typography>
                <Typography>Status: {selectedJeep.status}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1">Driver: {selectedJeep.driver.name}</Typography>
                <Typography>Driver Status: {selectedJeep.driver.status}</Typography>
                <Typography>Direction: {selectedJeep.direction}</Typography>
              </Box>
            ) : (
              <Typography variant="body2">Click a jeep marker to see its status</Typography>
            )}
          </StatusContainer>
        </Grid>

        <Grid item xs={12} md={9}>
          {/* Leaflet Map with Jeep Markers */}
          <MapContainer center={[16.493911, 121.112795]} zoom={13} style={{ height: "600px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {jeepData.map((jeep, index) => (
              <Marker
                key={index}
                position={[jeep.location.lat, jeep.location.lng]}
                eventHandlers={{
                  click: () => {
                    handleJeepClick(jeep);
                  },
                }}
              >
                <Popup>
                  <Typography variant="h6">{jeep.plateNumber}</Typography>
                  <Typography>Model: {jeep.model}</Typography>
                  <Typography>Route: {jeep.route}</Typography>
                  <Typography>Status: {jeep.status}</Typography>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
}

export default Commuter;