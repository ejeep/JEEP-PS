import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Box, Grid, Typography, Card } from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import BuildIcon from "@mui/icons-material/Build";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import { styled } from "@mui/system";
import axios from "axios";

// Fix for missing marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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

  // Count the jeeps based on their status (excluding broken and maintenance jeeps)
  const countStatus = (status) =>
    jeepLocations.filter(
      (jeep) =>
        jeep.status === status &&
        jeep.condition !== "broken" &&
        jeep.condition !== "maintenance" &&
        jeep.plateNumber && // Ensures plateNumber exists and is truthy
        jeep.plateNumber !== "not assigned" // Excludes "not assigned"
    ).length;
  
  // Filter out jeeps that are "broken" or "on maintenance"
  const filteredJeepLocations = jeepLocations.filter(
    (jeep) =>
      jeep.condition !== "broken" &&
      jeep.condition !== "maintenance" &&
      jeep.plateNumber // Ensure plateNumber exists
  );

  // Calculate the total number of active jeeps (not broken or under maintenance)
  const totalActiveJeeps = filteredJeepLocations.length;

  return (
    <DashboardContainer>
      {/* Summary Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <DirectionsBusIcon /> Total Jeeps
            </Typography>
            <Typography variant="h4">{totalActiveJeeps}</Typography>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <DriveEtaIcon /> En Route
            </Typography>
            <Typography variant="h4">{countStatus("en route")}</Typography>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <HourglassEmptyIcon /> Waiting
            </Typography>
            <Typography variant="h4">{countStatus("waiting")}</Typography>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <BuildIcon /> Maintenance
            </Typography>
            <Typography variant="h4">{countStatus("maintenance")}</Typography>
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Jeep Information and Map */}
      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={12} md={3}>
          <StatusContainer>
            <Typography variant="h6" gutterBottom>
              Jeep Information
            </Typography>
            {selectedJeep ? (
              <>
                <Typography>Jeep ID: {selectedJeep.arduinoID}</Typography>
                <Typography>Plate Number: {selectedJeep.plateNumber}</Typography>                
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
              <Typography variant="body2">
                {" "}
                Click on a marker on the map to view details about the selected
                jeepney.
              </Typography>
            )}
          </StatusContainer>
        </Grid>
        <Grid item xs={12} md={9}>
          <MapContainer
            center={[16.4939, 121.1128]}
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
                      <strong>Available Seats:</strong> {jeep.seatAvailability}
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
          </MapContainer>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
}

export default AdminDashboard;

