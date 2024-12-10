import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  Paper,
  IconButton,
  Modal,
  TextField,
  Typography,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
} from "@mui/material";
import {Delete, Search } from "@mui/icons-material";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid"; // Import DataGrid
import "./Jeeps.css";

const API_BASE_URL = "http://localhost:3004";

function Schedule() {
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // New state for delete confirmation dialog
  const [selectedJeep, setSelectedJeep] = useState(null);  
  const [jeeps, setJeeps] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJeeps, setFilteredJeeps] = useState([]);
  const [scheduleData, setScheduleData] = useState({
    timeSchedule: "",
  });
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    fetchJeeps();
  }, []);

  const fetchJeeps = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jeep-data/jeeps`);
      setJeeps(response.data);
      setFilteredJeeps(response.data);
    } catch (error) {
      handleError("Error fetching jeeps");
    }
  };


  const handleError = (message) => {
    setSnackbarMessage(message);
    setSnackbarSeverity("error"); // Set severity to error
    setOpenSnackbar(true);
  };

  const handleSuccess = (message) => {
    setSnackbarMessage(message);
    setSnackbarSeverity("success"); // Set severity to success
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenDeleteDialog = (jeep) => {
    setSelectedJeep(jeep); // Save the jeep object to be deleted
    setOpenDeleteDialog(true); // Open the delete confirmation dialog
  };

  // Handle closing the delete confirmation dialog without deleting
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false); // Close the delete confirmation dialog
  };


  const handleOpenScheduleModal = (jeep) => {
    setSelectedJeep(jeep); // Set the selected jeep for the schedule modal
    setScheduleData({ timeSchedule: jeep.timeSchedule || "" }); // Set existing schedule data if available
    setOpenScheduleModal(true); // Open the modal
  };

  const handleScheduleChange = (e) => {
    setScheduleData({ ...scheduleData, [e.target.name]: e.target.value }); // Update schedule time
  };

  const handleCloseScheduleModal = () => setOpenScheduleModal(false);

  const handleRemoveSchedule = async () => {
    if (!selectedJeep) return; // Check if a jeep is selected
  
    try {
      // Send PUT request to update the jeep's timeSchedule to an empty array
      const response = await axios.put(
        `${API_BASE_URL}/jeep-data/updateVehicle/${selectedJeep.plateNumber}`,
        {
          timeSchedule: [],  // Clear the timeSchedule by setting it to an empty array
        }
      );
  
      const updatedJeep = response.data;
  
      // Update the state to reflect the change in the jeep's schedule
      setJeeps((prevJeeps) =>
        prevJeeps.map((jeep) =>
          jeep.plateNumber === updatedJeep.plateNumber ? updatedJeep : jeep
        )
      );
  
      setFilteredJeeps((prevFilteredJeeps) =>
        prevFilteredJeeps.map((jeep) =>
          jeep.plateNumber === updatedJeep.plateNumber ? updatedJeep : jeep
        )
      );
  
      fetchJeeps();
      handleCloseDeleteDialog();
    } catch (error) {
      handleError("Error removing jeep's schedule");
    }
  };
  
  

  const handleAssignSchedule = async () => {
    // Check if a jeep is selected and if the timeSchedule is provided
    if (!selectedJeep || !scheduleData.timeSchedule) {
      return handleError("Please specify a schedule time");
    }

    try {
      // Send PUT request to update the schedule for the selected jeep
      const response = await axios.put(
        `${API_BASE_URL}/jeep-data/updateVehicle/${selectedJeep.plateNumber}`,
        {
          timeSchedule: scheduleData.timeSchedule, // Schedule data to be updated
        }
      );

      const updatedJeep = response.data;

      // Update the jeeps list to reflect the changes for the updated jeep
      setJeeps((prevJeeps) =>
        prevJeeps.map((jeep) =>
          jeep.plateNumber === updatedJeep.plateNumber ? updatedJeep : jeep
        )
      );

      // Similarly, update the filtered jeeps list if you have one
      setFilteredJeeps((prevFilteredJeeps) =>
        prevFilteredJeeps.map((jeep) =>
          jeep.plateNumber === updatedJeep.plateNumber ? updatedJeep : jeep
        )
      );

      // Close the schedule modal after the update
      handleCloseScheduleModal();

      // Success message after the schedule is assigned
      handleSuccess("Schedule successfully saved!");
    } catch (error) {
      // Handle any errors that occur during the scheduling process
      handleError("Error assigning schedule");
    }
  };


  const handleSearch = (e) => {
    const filteredJeeps = jeeps.filter((jeep) => {
      const plateNumber = jeep.plateNumber || ""; // Default to an empty string if undefined
      const assignedDriver = jeep.assignedDriver || ""; // Default to an empty string if undefined

      return (
        plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignedDriver.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredJeeps(filteredJeeps);
  };


  // Columns definition for the DataGrid
  const columns = [
    { field: "plateNumber", headerName: "Plate Number", width: 150 },
    { field: "routeDirection", headerName: "Route Direction", width: 200 },
    { field: "assignedDriver", headerName: "Assigned Driver", width: 250 },
    { field: "timeSchedule", headerName: "Schedule Time", width: 250 },
    {
      field: "actions",
      headerName: "Actions",
      width: 350,
      renderCell: (params) => (
        <>
        <Button
            variant="outlined" // Change to outlined to match theme
            onClick={() => handleOpenScheduleModal(params.row)}
            style={{
              borderColor: "#4CAF50", // Green border
              color: "#4CAF50", // Green text
            }}
          >
            Assign Schedule
          </Button>
          <span style={{ margin: "0 8px" }}></span>
          <Button
            variant="outlined" // Change to outlined to match theme
            onClick={() => handleOpenDeleteDialog(params.row)}
            style={{
              borderColor: "#F44336", // Green border
              color: "#F44336", // Green text
            }}
          >
            Clear Schedule
          </Button>         
        </>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Schedule Management
      </Typography>

      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item></Grid>
        <Grid item>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={handleSearch}
            sx={{ mb: 2, width: "250px" }}
            InputProps={{
              endAdornment: <Search />,
            }}
          />
        </Grid>
      </Grid>

      <Paper elevation={3}>
        <DataGrid
          rows={filteredJeeps}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row.plateNumber}
          disableSelectionOnClick
        />
      </Paper>

      <Modal
        open={openScheduleModal}
        onClose={handleCloseScheduleModal}
        aria-labelledby="schedule-modal-title"
        aria-describedby="schedule-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography id="schedule-modal-title" variant="h6" component="h2" >
            Assign Schedule for {selectedJeep?.plateNumber}
          </Typography>
          <TextField
            label="Schedule Time"
            variant="outlined"
            name="timeSchedule"
            fullWidth
            value={scheduleData.timeSchedule}
            onChange={handleScheduleChange}
            style={{ marginBottom: "20px", marginTop: "20px" }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              onClick={handleCloseScheduleModal}
              style={{
                width: "48%",
                backgroundColor: "#fff",
                color: "#4CAF50",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignSchedule}
              style={{
                width: "48%",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "1px solid #4CAF50",
              }}
            >
              Save Schedule
            </Button>
          </Box>
        </Box>
      </Modal>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to clear schedule?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            style={{
              borderColor: "#4CAF50", // Green border for Cancel
              color: "#4CAF50", // Green text
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRemoveSchedule} // Trigger delete function on confirmation
            style={{
              backgroundColor: "#4CAF50", // Green background for Assign Driver
              color: "#fff", // White text
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Duration to show the Snackbar before automatically closing
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Position at the bottom center
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Schedule;
