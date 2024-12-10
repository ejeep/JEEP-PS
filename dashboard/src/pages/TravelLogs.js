import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
} from "@mui/material";

const API_BASE_URL = "http://localhost:3004"; // Your API base URL
const POLLING_INTERVAL = 120000; // Polling interval in milliseconds (e.g., 5000ms = 5 seconds)

const TravelLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for feedback

  const fetchLogs = async () => {
    try {
      setLoading(true); // Show loading state
      const response = await axios.get(`${API_BASE_URL}/gps/locations`);
      setLogs(response.data); // Set fetched logs into state
    } catch (error) {
      console.error("Error fetching travel logs:", error);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLogs();

    // Poll for new data at regular intervals
    const intervalId = setInterval(fetchLogs, POLLING_INTERVAL);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box>
      <Box display="flex" justifyContent="center" alignItems="center" mb={2} padding={4} >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", flexGrow: 1 }}
        >
          Travel Logs
        </Typography>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#4CAF50", // Green background
            color: "#fff", // White text
          }}
          onClick={fetchLogs}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Jeep ID</TableCell>
              <TableCell>Plate Number</TableCell>
              <TableCell>Location (Lat, Lng)</TableCell>
              <TableCell>Speed (m/s)</TableCell>
              <TableCell>Seat Availability</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Direction</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.arduinoID}</TableCell>
                <TableCell>{log.plateNumber}</TableCell>
                <TableCell>
                  {log.jeepLocation.lat}, {log.jeepLocation.lng}
                </TableCell>
                <TableCell>{log.speed}</TableCell>
                <TableCell>{log.seatAvailability}</TableCell>
                <TableCell>{log.status}</TableCell>
                <TableCell>{log.direction}</TableCell>
                <TableCell>{log.condition}</TableCell>
                <TableCell>
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TravelLogs;
