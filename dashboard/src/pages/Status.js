import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Card, CardContent, Divider } from "@mui/material";
import axios from "axios";
import "./Status.css";

function Status() {
  const [jeeps, setJeeps] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jeep and driver data from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jeepsResponse = await axios.get("http://localhost:3004/jeep-data/jeeps");
        const driversResponse = await axios.get("http://localhost:3004/driver-data/drivers");

        // Set jeeps and drivers
        setJeeps(
          jeepsResponse.data.map((jeep) => {
            const assignedDriver = getAssignedDriver(jeep, driversResponse.data);
            if (assignedDriver.name !== "Unassigned" && !jeep.status) {
              jeep.status = "Waiting"; // Set default status to "Waiting" if a driver is assigned and no status is set
            }
            return jeep;
          })
        );
        setDrivers(driversResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to find the assigned driver for each jeep
  const getAssignedDriver = (jeep, driverList = drivers) => {
    const driver = driverList.find((driver) => driver.id === jeep.driverId);
    return driver ? driver : { name: "Unassigned", status: "N/A" };
  };

  // Function to handle switch flip (triggered by Arduino)
  const handleSwitchFlip = async (jeep) => {
    try {
      // Set status to "En Route" when switch is flipped
      await axios.put(`http://localhost:3004/jeep-data/jeeps/${jeep.id}`, { status: "En Route" });
      setJeeps((prevJeeps) =>
        prevJeeps.map((j) => (j.id === jeep.id ? { ...j, status: "En Route" } : j))
      );
    } catch (error) {
      console.error("Error updating jeep status to En Route:", error);
      setError("Failed to update status.");
    }
  };

  // Render the jeeps based on their direction (North/South Bound)
  const renderJeeps = (direction) =>
    jeeps
      .filter((jeep) => jeep.routeDirection === direction)
      .map((jeep, index) => {
        const assignedDriver = getAssignedDriver(jeep);

        return (
          <Card key={index} className="status-card">
            <CardContent>
              <Typography variant="h6">Plate: {jeep.plateNumber}</Typography>
              <Typography>Model: {jeep.model}</Typography>
              <Typography>Route: {jeep.route}</Typography>

              {/* Display Status */}
              <Typography variant="subtitle1">
                Status: {jeep.status || "Waiting"} {/* Default to "Waiting" if no status is set */}
              </Typography>

              <Divider className="divider" />
              <Typography variant="subtitle1">Driver: {jeep.assignedDriver}</Typography>
            </CardContent>
          </Card>
        );
      });

  if (loading) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" align="center" color="error">{error}</Typography>;
  }

  return (
    <Box className="status-container">
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Typography variant="h5" align="center" className="heading">
            North Bound
          </Typography>
          <Box className="floating-container">{renderJeeps("North Bound")}</Box>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" align="center" className="heading">
            South Bound
          </Typography>
          <Box className="floating-container">{renderJeeps("South Bound")}</Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Status;
