import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Box, Grid, Typography, Card, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

// Fix for missing marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  minHeight: "100vh",
  backgroundColor: "#f5f5f5",
}));

const DashboardCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#28a745",
  color: "#fff",
  textAlign: "center",
  padding: theme.spacing(2),
  borderRadius: "12px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
}));

const StatusContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#ffffff",
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
  height: "100%",
  borderRadius: "12px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  overflowY: "auto",
  maxHeight: "450px", // Prevent excessive height
}));

const SearchBarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  gap: theme.spacing(2),
  flexDirection: "row",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: theme.spacing(1),
  },
}));

function AdminDashboard() {
  const [jeepLocations, setJeepLocations] = useState([]);
  const [selectedJeep, setSelectedJeep] = useState(null);

  // Fetch jeep location data from API
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

    // Optionally, poll the API every few seconds for real-time updates
    const interval = setInterval(fetchJeepLocations, 600000); // Update every 10 minutes
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleJeepClick = (jeep) => {
    setSelectedJeep(jeep);
  };

  // Count the jeeps based on their status
  const countStatus = (status) => jeepLocations.filter((jeep) => jeep.status === status).length;

  return (
    <DashboardContainer>
      {/* Summary Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <Typography variant="h6">Total Jeeps</Typography>
            <Typography variant="h4">{jeepLocations.length}</Typography>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <Typography variant="h6">En Route</Typography>
            <Typography variant="h4">{countStatus("en route")}</Typography>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <Typography variant="h6">Waiting</Typography>
            <Typography variant="h4">{countStatus("waiting")}</Typography>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <Typography variant="h6">Maintenance</Typography>
            <Typography variant="h4">{countStatus("maintenance")}</Typography>
          </DashboardCard>
        </Grid>
      </Grid>
      
      {/* Search Bar */}
      <SearchBarContainer>
        <TextField variant="outlined" placeholder="Search..." fullWidth />
        <Button variant="contained" style={{ backgroundColor: "#4CAF50", color: "#fff" }}>
          Search
        </Button>
      </SearchBarContainer>

      {/* Jeep Information and Map */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <StatusContainer>
            <Typography variant="h6" gutterBottom>
              Jeep Information
            </Typography>
            {selectedJeep ? (
              <>
                <Typography variant="body1">Jeep ID: {selectedJeep.jeepID}</Typography>
                <Typography variant="body2">
                  Last Updated: {new Date(selectedJeep.timestamp).toLocaleString()}
                </Typography>
              </>
            ) : (
              <Typography variant="body2">Click a jeep marker to see its status</Typography>
            )}
          </StatusContainer>
        </Grid>
        <Grid item xs={12} md={9}>
          <MapContainer
            center={[16.4939, 121.1128]}
            zoom={13}
            style={{ height: "450px", width: "100%", borderRadius: "12px", overflow: "hidden" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {jeepLocations.map((jeep, index) => (
              <Marker
                key={index}
                position={[jeep.jeepLocation.lat, jeep.jeepLocation.lng]}
                eventHandlers={{
                  click: () => handleJeepClick(jeep),
                }}
              >
                <Popup>
                  <Typography>Jeep ID: {jeep.jeepID}</Typography>
                  <Typography>
                    Last Updated: {new Date(jeep.timestamp).toLocaleString()}
                  </Typography>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
}

export default AdminDashboard;
