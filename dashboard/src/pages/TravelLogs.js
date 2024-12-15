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
const POLLING_INTERVAL = 30000; // Polling interval in milliseconds (e.g., 30 seconds)

const TravelLogs = () => {
  const [logs, setLogs] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch logs from API
  const fetchLogs = async () => {
    try {
      setLoading(true);

      // Fetch logs from /gps/locations endpoint
      const response = await axios.get(`${API_BASE_URL}/gps/locations`);
      console.log("API Response:", response.data);

      const travelResponse = await axios.get(`${API_BASE_URL}/travel/logs`);
      console.log("API Response from /travel/logs:", travelResponse.data);

      const jeeplogs = response.data; // Assign fetched data to a variable
      const logs = travelResponse.data; // Assign fetched data to a variable

      // Set logs and filter by today's logs
      setLogs(logs);
      filterLogsByToday(logs);

      // Post logs to /travel/logs endpoint
      const postResponse = await axios.post(
        `${API_BASE_URL}/travel/logs`,
        jeeplogs
      );
      console.log("Posted Logs Response:", postResponse.data);
    } catch (error) {
      console.error("Error fetching or posting travel logs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter logs to include only today's entries
  const filterLogsByToday = (logs) => {
    const today = new Date().toISOString().split("T")[0];
    const filteredLogs = logs.filter(
      (log) =>
        log.timestamp && new Date(log.timestamp).toISOString().startsWith(today)
    );
    setDailyLogs(filteredLogs);
  };

  // Function to format travel duration in seconds to HH:MM:SS format
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    // Return the formatted string with hours, minutes, and seconds
    return `${hours}h:${minutes}min:${secs < 10 ? "0" + secs : secs}sec`;
  };

  useEffect(() => {
    fetchLogs();

    // Poll for new data at regular intervals
    const intervalId = setInterval(fetchLogs, POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={2}
        padding={4}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", flexGrow: 1 }}
        >
          Daily Travel Logs
        </Typography>
        <Button
          variant="contained"
          onClick={fetchLogs}
          disabled={loading}
          sx={{ backgroundColor: "#4CAF50", color: "#fff" }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      {/* Travel Logs Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Jeep ID</TableCell>
              <TableCell>Plate Number</TableCell>
              <TableCell>Location (Lat, Lng)</TableCell>
              <TableCell>Speed</TableCell>
              <TableCell>Seat Availability</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Direction</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Travel Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : dailyLogs.length > 0 ? (
              dailyLogs.map((log, index) => (
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
                  <TableCell>{formatDuration(log.travelDuration)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No logs available for today.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={2}
        padding={4}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", flexGrow: 1 }}
        >
          All Travel Logs
        </Typography>
      </Box>
      {/* All Travel Logs Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Jeep ID</TableCell>
              <TableCell>Plate Number</TableCell>
              <TableCell>Location (Lat, Lng)</TableCell>
              <TableCell>Speed</TableCell>
              <TableCell>Seat Availability</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Direction</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Travel Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : logs.length > 0 ? (
              logs.map((log, index) => (
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
                  <TableCell>{formatDuration(log.travelDuration)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No logs available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TravelLogs;
