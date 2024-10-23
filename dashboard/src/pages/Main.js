import React, { useState } from "react";
import { Box, Typography, Card, Button } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

// Dummy data for Jeepneys (can be used later for adding markers or details)
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

// Styling for the floating control panel on the left
const ControlPanel = styled(Card)(({ theme }) => ({
  backgroundColor: "#ffffff",
  width: "300px",
  height: "50vh", // Set height to 50% of the viewport height
  position: "absolute",
  top: "20px",
  left: "20px",
  zIndex: 1000, // Make sure it floats on top of the map
  borderRadius: "12px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  overflowY: "auto", // Enable scrolling if content exceeds height
  [theme.breakpoints.down("sm")]: {
    width: "90%",
    left: "5%", // Center the panel horizontally
    height: "40vh", // Adjust height for smaller screens
  },
}));

// Styling for the control panel header
const ControlPanelHeader = styled(Box)(({ theme }) => ({
  backgroundColor: "#4caf50", // Green color for the header
  padding: theme.spacing(2),
  borderTopLeftRadius: "12px",
  borderTopRightRadius: "12px",
}));

// Styling for the right-side buttons
const RightButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#28a745",
  color: "#ffffff",
  position: "absolute",
  top: "20px",
  right: "120px", // Adjusted to fit the login button beside
  zIndex: 1000,
  padding: theme.spacing(1.5, 3),
  borderRadius: "20px",
  fontWeight: "bold",
  [theme.breakpoints.down("sm")]: {
    top: "auto",
    bottom: "80px", // Increased space from the Login button
    right: "50%",
    transform: "translateX(50%)",
    width: "90%",
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#ffffff",
  color: "#28a745", // Green text
  position: "absolute",
  top: "20px",
  right: "20px", // Positioned beside the 'See All Jeeps' button
  zIndex: 1000,
  padding: theme.spacing(1.5, 3),
  borderRadius: "20px",
  fontWeight: "bold",
  [theme.breakpoints.down("sm")]: {
    top: "auto",
    bottom: "20px", // Space from the bottom of the viewport
    right: "50%",
    transform: "translateX(50%)",
    width: "90%",
  },
}));

function Main() {
  const navigate = useNavigate();

  return (
    <Box sx={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* Left-side control panel (floating over the map) */}
      <ControlPanel>
        <ControlPanelHeader>
          <Typography variant="h6" sx={{ color: "#ffffff" }}>
            Jeepney Control Panel
          </Typography>
        </ControlPanelHeader>
        <Box sx={{ padding: 2 }}>
          <Typography variant="body2">Select a jeepney to view details.</Typography>
        </Box>
      </ControlPanel>

      {/* Right-side buttons */}
      <RightButton variant="contained" onClick={() => navigate("/commuter")}>
        See All Jeeps
      </RightButton>
      <LoginButton variant="outlined" onClick={() => navigate("/login")}>
        Login
      </LoginButton>

      {/* Google Maps iframe as the background */}
      <Box sx={{ height: "100%", width: "100%" }}>
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d72791.59467740786!2d121.11279533982378!3d16.493911448929403!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x339044168316ed47%3A0x6984d3194e8cb833!2sBayombong%2C%20Nueva%20Vizcaya!5e0!3m2!1sen!2sph!4v1726255317782!5m2!1sen!2sph"
          width="100%"
          height="100%"
          style={{ border: 0, position: "absolute", top: 0, left: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </Box>
    </Box>
  );
}

export default Main;
