import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

function GPSDataPage() {
  const [gpsData, setGPSData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [plateNumbers, setPlateNumbers] = useState([]);
  const [selectedPlateNumber, setSelectedPlateNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGPSData = async () => {
      try {
        const response = await axios.get("http://localhost:3004/gps/locations");
        setGPSData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching GPS data:", error);
        setError("Failed to load GPS data.");
        setLoading(false);
      }
    };

    const fetchPlateNumbers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3004/jeep-data/jeeps"
        );
        setPlateNumbers(response.data);
      } catch (error) {
        console.error("Error fetching plate numbers:", error);
      }
    };

    fetchGPSData();
    fetchPlateNumbers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = gpsData.filter((data) =>
      data.jeepID.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const handleAssignJeep = async (jeepID) => {
    if (!selectedPlateNumber) {
      alert("Please select a plate number.");
      return;
    }

    const selectedJeep = gpsData.find((data) => data.jeepID === jeepID);

    if (!selectedJeep) {
      alert("Jeep with the selected Plate Number not found.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3004/gps/assign-vehicle/${selectedJeep.jeepID}`,
        { plateNumber: selectedPlateNumber }
      );
      alert(`Jeep with plate number ${selectedPlateNumber} has been assigned.`);
      setSelectedPlateNumber(""); // Reset selection
    } catch (error) {
      console.error("Error updating jeep data:", error);
      alert("Failed to assign jeep.");
    }
  };

  if (loading) {
    return (
      <Typography variant="h6" align="center">
        Loading GPS Data...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" align="center" color="error">
        {error}
      </Typography>
    );
  }

  // Columns definition for DataGrid
  const columns = [
    { field: "jeepID", headerName: "Jeep ID", width: 150 },
    { field: "direction", headerName: "Direction", width: 150 },
    { field: "seatAvailability", headerName: "Seats", width: 120 },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleAssignJeep(params.row.jeepID)}
        >
          Assign Jeep
        </Button>
      ),
    },
  ];

  // Rows for the DataGrid
  const rows = filteredData.map((data) => ({
    jeepID: data.jeepID,
    direction: data.direction,
    seatAvailability: data.seatAvailability,
    status: data.status,
  }));

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Jeepney GPS Tracker
      </Typography>

      <Box sx={{ marginBottom: 2, textAlign: "center" }}>
        <TextField
          variant="outlined"
          placeholder="Search by Jeep ID"
          value={searchQuery}
          onChange={handleSearch}
          sx={{
            width: "300px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            marginRight: "16px",
          }}
        />
        <FormControl sx={{ minWidth: 200, marginRight: "16px" }}>
          <InputLabel>Select Plate Number</InputLabel>
          <Select
            value={selectedPlateNumber}
            onChange={(e) => setSelectedPlateNumber(e.target.value)}
          >
            {plateNumbers.map((plate) => (
              <MenuItem key={plate.plateNumber} value={plate.plateNumber}>
                {plate.plateNumber}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={4}>
        {/* DataGrid Section */}
        <Grid item xs={12}>
          <Paper elevation={3}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              getRowId={(row) => row.jeepID} // This ensures the DataGrid uses `jeepID` as the unique id
              disableSelectionOnClick
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default GPSDataPage;
