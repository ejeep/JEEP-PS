import React, { useState } from "react";
import { Box, Grid, Typography, Card, Divider, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";

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
  },
];

// Container for the whole dashboard
const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
}));

// Styled component for cards with green background
const DashboardCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#28a745", // Green color
  color: "#fff",
  textAlign: "center",
  padding: theme.spacing(2),
  borderRadius: "12px", // Rounded corners for better UI
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
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

function AdminDashboard() {
  const [selectedJeep, setSelectedJeep] = useState(null);

  // Handle clicking a jeep marker (dummy interaction)
  const handleJeepClick = (jeep) => {
    setSelectedJeep(jeep);
  };

  return (
    <DashboardContainer>
      {/* Top row of cards displaying summary data */}
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">150</Typography>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <Typography variant="h6">Total Drivers</Typography>
            <Typography variant="h4">45</Typography>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <Typography variant="h6">Total Jeeps</Typography>
            <Typography variant="h4">60</Typography>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <Typography variant="h6">Pending Reports</Typography>
            <Typography variant="h4">10</Typography>
          </DashboardCard>
        </Grid>
      </Grid>

      <br />
      {/* Search bar and button */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px', flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          fullWidth
          sx={{ marginBottom: { xs: 2, sm: 0 }, marginRight: { sm: '10px' } }}
        />
        <Button variant="contained" style={{ backgroundColor: "#4CAF50", color: "#fff" }}>
          Search
        </Button>
      </Box>

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
          {/* Map with Jeep Markers */}
          <div style={{ width: "100%", height: "450px", position: "relative" }}>
            <iframe
              title="Jeep Map" // Unique title for accessibility
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d72791.59467740786!2d121.11279533982378!3d16.493911448929403!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x339044168316ed47%3A0x6984d3194e8cb833!2sBayombong%2C%20Nueva%20Vizcaya!5e0!3m2!1sen!2sph!4v1726255317782!5m2!1sen!2sph"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Simulated jeep markers */}
            {mockData.map((jeep, index) => (
              <div
                key={index}
                onClick={() => handleJeepClick(jeep)}
                style={{
                  position: "absolute",
                  top: `${index * 50 + 100}px`, // Dummy positions for markers
                  left: `${index * 50 + 200}px`,
                  cursor: "pointer",
                }}
              >
                🚐
              </div>
            ))}
          </div>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
}

export default AdminDashboard;
