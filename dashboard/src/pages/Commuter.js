import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Card, Divider, TextField, Button, Paper } from "@mui/material";
import { styled } from "@mui/system";

// Styled components
const DisplayContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
  backgroundColor: '#f0f0f0',
  minHeight: '100vh'
});

const InfoPanel = styled(Card)({
  padding: '1rem',
  marginBottom: '1rem',
  textAlign: 'center',
  backgroundColor: '#1976d2',
  color: '#fff',
});

// Main component
const CommuterPage = () => {
  const [jeepData, setJeepData] = useState([]);
  
  useEffect(() => {
    // Fetch jeep data here, replace with your API endpoint
    // setJeepData(response);
  }, []);

  return (
    <DisplayContainer>
      <Typography variant="h4" align="center" gutterBottom>
        Commute Tracking System
      </Typography>

      {/* Header Information */}
      <InfoPanel>
        <Typography variant="h6">Jeepney Location Display</Typography>
        <Typography variant="subtitle1">Real-time Location Updates</Typography>
      </InfoPanel>

      <Divider />

      {/* Commute Information Table */}
      <Paper elevation={3} sx={{ padding: '1rem', marginTop: '1rem' }}>
        <Grid container spacing={2}>
          <Grid item xs={3}><Typography variant="subtitle2">Jeep ID</Typography></Grid>
          <Grid item xs={3}><Typography variant="subtitle2">Route</Typography></Grid>
          <Grid item xs={3}><Typography variant="subtitle2">Status</Typography></Grid>
          <Grid item xs={3}><Typography variant="subtitle2">ETA</Typography></Grid>
        </Grid>
        <Divider sx={{ my: 1 }} />

        {jeepData.map((jeep, index) => (
          <Grid container key={index} spacing={2}>
            <Grid item xs={3}><Typography>{jeep.plateNumber}</Typography></Grid>
            <Grid item xs={3}><Typography>{jeep.route}</Typography></Grid>
            <Grid item xs={3}><Typography>{jeep.status}</Typography></Grid>
            <Grid item xs={3}><Typography>{jeep.eta}</Typography></Grid>
          </Grid>
        ))}
      </Paper>

      {/* Search Field */}
      <Box display="flex" justifyContent="center" mt={2}>
        <TextField label="Search Jeep ID" variant="outlined" sx={{ mr: 2 }} />
        <Button variant="contained" color="primary">Search</Button>
      </Box>
    </DisplayContainer>
  );
};

export default CommuterPage;
