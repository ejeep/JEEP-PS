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

      setSnackbarMessage(response.data.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      const updatedGPSData = await axios.get(
        "http://localhost:3004/gps/locations"
      );
      setGPSData(updatedGPSData.data);
      setFilteredData(updatedGPSData.data);

      setOpenModal(false);
    } catch (error) {
      setSnackbarMessage("Failed to assign jeep.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Function to handle deleting a GPS data entry
  const handleDelete = async (arduinoID) => {
    try {
      const response = await axios.delete(
        `http://localhost:3004/gps/locations/${arduinoID}`
      );

      setSnackbarMessage(response.data.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Remove the deleted entry from the GPS data state
      const updatedGPSData = gpsData.filter(
        (data) => data.arduinoID !== arduinoID
      );
      setGPSData(updatedGPSData);
      setFilteredData(updatedGPSData); // Update filtered data as well
    } catch (error) {
      setSnackbarMessage("Failed to delete GPS data.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const rows = filteredData
    .filter((data) => data.arduinoID)
    .map((data) => ({
      id: data.arduinoID,
      arduinoID: data.arduinoID,
      direction: data.direction,
      seatAvailability: data.seatAvailability,
      status: data.status,
      plateNumber: data.plateNumber || "Not Assigned",
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

      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item></Grid>
        <Grid item>
          <TextField
            variant="outlined"
            placeholder="Search by Jeep ID"
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              mb: 2,
              width: "300px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              marginRight: "16px",
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <DataGrid
              rows={rows}
              columns={[
                { field: "arduinoID", headerName: "Arduino ID", width: 150 },
                {
                  field: "plateNumber",
                  headerName: "Plate Number",
                  width: 180,
                  renderCell: (params) => (
                    <Typography variant="body1" style={{ marginTop: "12px" }}>
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
                  width: 350,
                  renderCell: (params) => (
                    <Box>
                      <Button
                        variant="outlined"
                        style={{
                          borderColor: "#4CAF50",
                          color: "#4CAF50",
                        }}
                        onClick={() => handleOpenModal(params.row.arduinoID)}
                      >
                        Assign Jeep
                      </Button>
                      <span style={{ margin: "0 8px" }}></span>
                      <Button
                        variant="outlined"
                        color="error"
                        style={{
                          borderColor: "#f44336",
                          color: "#f44336",
                        }}
                        onClick={() => handleDelete(params.row.arduinoID)}
                      >
                        Remove Tracker
                      </Button>
                    </Box>
                  ),
                },
              ]}
              pageSize={5}
              getRowId={(row) => row.id}
              disableSelectionOnClick
            />
          </Paper>
        </Grid>
      </Grid>

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
          <Button
            onClick={handleCloseModal}
            style={{
              borderColor: "#4CAF50", // Green border for Cancel
              color: "#4CAF50", // Green text
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleAssignJeep(selectedArduinoID, selectedPlateNumber)
            }
            style={{
              backgroundColor: "#4CAF50", // Green background for Assign Driver
              color: "#fff", // White text
            }}
          >
            Assign Jeep
          </Button>
        </DialogActions>
      </Dialog>

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
