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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
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
  const [openModal, setOpenModal] = useState(false);
  const [selectedArduinoID, setSelectedArduinoID] = useState("");

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
        const response = await axios.get("http://localhost:3004/jeep-data/jeeps");
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
      data.arduinoID.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const handleOpenModal = (arduinoID) => {
    setSelectedArduinoID(arduinoID);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAssignJeep = async (arduinoID, plateNumber) => {
    try {
      const response = await axios.put(
        `http://localhost:3004/gps/assign-vehicle/${arduinoID}`,
        { plateNumber }
      );
  
      // Success: Update the snackbar message and show it
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true); // Show the Snackbar
  
      // Re-fetch the GPS data to ensure the table is updated
      const updatedGPSData = await axios.get("http://localhost:3004/gps/locations");
      setGPSData(updatedGPSData.data);
      setFilteredData(updatedGPSData.data);  // Update filtered data as well
  
      // Close the modal after successful assignment
      setOpenModal(false);
    } catch (error) {
      // Error: Show an error message in the Snackbar
      setSnackbarMessage("Failed to assign jeep.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true); // Show the Snackbar
    }
  };
  

  // Dynamically update the rows for DataGrid whenever gpsData changes
  const rows = filteredData
    .filter((data) => data.arduinoID) // Ensure only rows with arduinoID are included
    .map((data) => ({
      id: data.arduinoID, // Ensure each row has an 'id' field
      arduinoID: data.arduinoID,
      direction: data.direction,
      seatAvailability: data.seatAvailability,
      status: data.status,
      plateNumber: data.plateNumber || "Not Assigned", // Default text when no plate number assigned
    }));

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
      </Box>

      <Grid container spacing={4}>
        {/* DataGrid Section */}
        <Grid item xs={12}>
          <Paper elevation={3}>
            <DataGrid
              rows={rows}
              columns={[
                { field: "arduinoID", headerName: "Arduino ID", width: 150 },
                {
                  field: "plateNumber", // New column to display the plate number
                  headerName: "Plate Number",
                  width: 180,
                  renderCell: (params) => (
                    <Typography variant="body1">
                      {params.row.plateNumber || "Not Assigned"}
                    </Typography>
                  ),
                },
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
                      onClick={() => handleOpenModal(params.row.arduinoID)} // Open modal when clicking the button
                    >
                      Assign Jeep
                    </Button>
                  ),
                },
              ]}
              pageSize={5}
              getRowId={(row) => row.id} // This ensures the DataGrid uses `arduinoID` as the unique id
              disableSelectionOnClick
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Modal for Plate Number Selection */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Select Plate Number</DialogTitle>
        <DialogContent>
          <FormControl sx={{ minWidth: 200 }}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleAssignJeep(selectedArduinoID, selectedPlateNumber)
            }
            color="primary"
          >
            Assign Jeep
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for displaying success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default GPSDataPage;
