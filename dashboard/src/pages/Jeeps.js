import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  Paper,
  IconButton,
  Modal,
  TextField,
  MenuItem,
  Typography,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Edit, Delete, Add, Search } from "@mui/icons-material";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid"; // Import DataGrid
import "./Jeeps.css";

const API_BASE_URL = "http://localhost:3004";

function Jeeps() {
  const [openModal, setOpenModal] = useState(false);
  const [openDriverModal, setOpenDriverModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // New state for delete confirmation dialog
  const [isEdit, setIsEdit] = useState(false);
  const [selectedJeep, setSelectedJeep] = useState(null);
  const [formData, setFormData] = useState({
    plateNumber: "",
    model: "",
    routeDirection: "North Bound",
  });
  const [jeeps, setJeeps] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [filteredJeeps, setFilteredJeeps] = useState([]);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    fetchJeeps();
    fetchDrivers();
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

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/driver-data/drivers`);
      setDrivers(response.data);
    } catch (error) {
      handleError("Error fetching drivers");
    }
  };

  // State to hold selected driver

  const handleDriverChange = (e) => {
    const driverName = e.target.value;
    const driver = activeDrivers.find((d) => d.name === driverName);
    setSelectedDriver(driver); // Update selected driver
  };

  const handleAssignClick = () => {
    if (selectedDriver) {
      handleAssignDriver(selectedDriver); // Assign driver only on button click
    }
  };

  const handleError = (message) => {
    setError(message);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenModal = () => {
    setFormData({
      plateNumber: "",
      model: "",
      routeDirection: "North Bound",
    });
    setIsEdit(false);
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleOpenDriverModal = (jeep) => {
    setSelectedJeep(jeep);
    setOpenDriverModal(true);
  };

  const handleCloseDriverModal = () => setOpenDriverModal(false);

  const handleOpenDeleteDialog = (jeep) => {
    console.log("Selected Jeep:", jeep); // Add this line to debug
    setSelectedJeep(jeep); // Store the selected jeep in the state
    setOpenDeleteDialog(true); // Open the delete dialog
  };

  // Handle closing the delete confirmation dialog without deleting
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false); // Close the delete confirmation dialog
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    // Form validation
    if (!formData.plateNumber || !formData.model) {
      return handleError("All fields are required");
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/jeep-data/addVehicle`,
        formData
      );
      setJeeps([...jeeps, response.data]);
      setFilteredJeeps((prevFilteredJeeps) => [
        ...prevFilteredJeeps,
        response.data,
      ]);
      handleCloseModal();
    } catch (error) {
      handleError("Error adding jeep");
    }
  };

  const handleEdit = async () => {
    if (!selectedJeep) return handleError("No jeep selected for editing");

    try {
      const response = await axios.put(
        `${API_BASE_URL}/jeep-data/updateVehicle/${selectedJeep.plateNumber}`,
        {
          routeDirection: formData.routeDirection,
        }
      );

      const updatedJeep = response.data;
      setJeeps((prevJeeps) =>
        prevJeeps.map((jeep) =>
          jeep.plateNumber === updatedJeep.plateNumber ? updatedJeep : jeep
        )
      );
      fetchJeeps();
      handleCloseModal();
    } catch (error) {
      handleError("Error editing jeep");
    }
  };

  const handleDelete = async () => {
    if (!selectedJeep) return; // Ensure selectedJeep exists

    console.log("Deleting jeep with plate number:", selectedJeep.plateNumber); // Debug log to check

    try {
      // Send DELETE request to remove the jeep using its plateNumber
      await axios.delete(
        `${API_BASE_URL}/jeep-data/deleteVehicle/${selectedJeep.plateNumber}`
      );

      // Update the state to remove the deleted jeep from the list
      setJeeps((prevJeeps) =>
        prevJeeps.filter(
          (jeep) => jeep.plateNumber !== selectedJeep.plateNumber
        )
      );
      setFilteredJeeps((prevFilteredJeeps) =>
        prevFilteredJeeps.filter(
          (jeep) => jeep.plateNumber !== selectedJeep.plateNumber
        )
      );

      // Close the dialog after successful deletion
      handleCloseDeleteDialog();
    } catch (error) {
      handleError("Error deleting jeep");
    }
  };

  const handleAssignDriver = async (driver) => {
    if (!driver) return handleError("No driver selected");

    // Check if the driver is already assigned to another jeep but not the current jeep
    const isDriverAssigned = jeeps.some(
      (jeep) =>
        jeep.plateNumber !== selectedJeep.plateNumber &&
        jeep.assignedDriver === driver.name
    );

    if (isDriverAssigned) {
      return setErrorMessage(
        "This driver is already assigned to another jeep."
      );
    }

    try {
      // Assign driver to the selected jeep
      const response = await axios.put(
        `${API_BASE_URL}/jeep-data/updateVehicle/${selectedJeep.plateNumber}`,
        {
          assignedDriver: driver.name,
        }
      );

      const updatedJeep = response.data;

      // Update the jeeps state and filteredJeeps immediately
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
      setSuccessMessage("Driver assigned successfully!"); // Set success message
      setOpenSnackbar(true); // Show Snackbar
      handleCloseDriverModal(); // Close the modal after assignment
    } catch (error) {
      setErrorMessage("Error assigning driver");
    }
  };

  const handleClearDriver = async (jeep) => {
    if (!jeep) return handleError("No jeep selected to clear the driver");

    try {
      // Make an API request to clear the driver assignment
      const response = await axios.put(
        `${API_BASE_URL}/jeep-data/updateVehicle/${jeep.plateNumber}`,
        {
          assignedDriver: null, // Clear the assigned driver
        }
      );

      const updatedJeep = response.data;

      // Update the state to reflect the cleared driver
      setJeeps((prevJeeps) =>
        prevJeeps.map((item) =>
          item.plateNumber === updatedJeep.plateNumber ? updatedJeep : item
        )
      );

      setFilteredJeeps((prevFilteredJeeps) =>
        prevFilteredJeeps.map((item) =>
          item.plateNumber === updatedJeep.plateNumber ? updatedJeep : item
        )
      );

      // Display success message
      setSuccessMessage("Driver cleared successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      handleError("Error clearing driver assignment");
    }
  };

  const handleOpenModalWithJeep = (jeep) => {
    setSelectedJeep(jeep);
    setFormData({
      plateNumber: jeep.plateNumber,
      model: jeep.model,
      routeDirection: jeep.routeDirection || "North Bound",
    });
    setIsEdit(true);
    setOpenModal(true);
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

  const activeDrivers = drivers.filter((driver) => driver.status === "Active");

  // Columns definition for the DataGrid
  const columns = [
    { field: "plateNumber", headerName: "Plate Number", width: 150 },
    { field: "model", headerName: "Model", width: 150 },
    { field: "routeDirection", headerName: "Route Direction", width: 150 },
    { field: "assignedDriver", headerName: "Assigned Driver", width: 250 },
    {
      field: "driverAssignment",
      headerName: "Driver Assignment",
      width: 460,
      renderCell: (params) => (
        <>
          {/* Assign Driver Button */}
          <Button
            variant="outlined"
            onClick={() => handleOpenDriverModal(params.row)}
            style={{
              borderColor: "#4CAF50", // Green border
              color: "#4CAF50", // Green text
            }}
          >
            Assign Driver
          </Button>

          {/* Spacer for button alignment */}
          <span style={{ margin: "0 8px" }}></span>

          {/* Clear Driver Button */}
          <Button
            variant="outlined"
            onClick={() => handleClearDriver(params.row)}
            style={{
              borderColor: "#F44336", // Red border
              color: "#F44336", // Red text
            }}
          >
            Clear Driver
          </Button>
        </>
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpenModalWithJeep(params.row)}>
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => handleOpenDeleteDialog(params.row)}
            style={{ color: "#4CAF50" }}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  // Rows for DataGrid (updated with dynamic data)
  const rows = jeeps.map((jeep) => ({
    id: jeep.plateNumber, // Using plateNumber as a unique id for each row
    plateNumber: jeep.plateNumber,
    model: jeep.model,

    assignedDriver: jeep.assignedDriver || "None",
  }));

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Vehicle Management
      </Typography>

      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{ marginBottom: 2, backgroundColor: "#4CAF50", color: "#fff" }}
          >
            <Add /> Add Jeep
          </Button>
        </Grid>
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

      {/* Jeep Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography id="modal-title" variant="h6" component="h2">
            {isEdit ? "Edit Jeep" : "Add Jeep"}
          </Typography>
          <TextField
            label="Plate Number"
            variant="outlined"
            name="plateNumber"
            fullWidth
            value={formData.plateNumber}
            onChange={handleChange}
            disabled={isEdit}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Model"
            variant="outlined"
            name="model"
            fullWidth
            value={formData.model}
            onChange={handleChange}
            disabled={isEdit}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Route Direction"
            select
            name="routeDirection"
            fullWidth
            value={formData.routeDirection}
            onChange={handleChange}
            style={{ marginBottom: "20px" }}
          >
            <MenuItem value="North Bound">North Bound</MenuItem>
            <MenuItem value="South Bound">South Bound</MenuItem>
          </TextField>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              onClick={handleCloseModal}
              style={{
                width: "48%",
                backgroundColor: "#fff", // Green background
                color: "#4CAF50",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={isEdit ? handleEdit : handleAdd}
              style={{
                width: "48%",
                backgroundColor: "#4CAF50", // Green background
                color: "#fff",
              }}
            >
              {isEdit ? "Save Changes" : "Add Jeep"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Driver Assignment Modal */}
      <Modal open={openDriverModal} onClose={handleCloseDriverModal}>
        <Box
          sx={{
            padding: 2,
            width: 400,
            margin: "auto",
            backgroundColor: "#ffffff", // White background
            borderRadius: 2,
            boxShadow: 3, // Add shadow for depth
          }}
        >
          <Typography variant="h6" sx={{ color: "#4CAF50" }}>
            Assign Driver to {selectedJeep?.plateNumber}
          </Typography>
          {activeDrivers.length > 0 ? (
            <TextField
              select
              label="Select Driver"
              value={selectedDriver?.name || ""}
              onChange={handleDriverChange}
              fullWidth
              margin="normal"
            >
              {activeDrivers.map((driver) => (
                <MenuItem key={driver.id} value={driver.name}>
                  {driver.name}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <Typography variant="body2" sx={{ color: "#D32F2F" }}>
              No active drivers available.
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={handleAssignClick}
              style={{
                backgroundColor: "#4CAF50", // Green background for Assign Driver
                color: "#fff", // White text
              }}
              disabled={!selectedDriver} // Disable button if no driver is selected
            >
              Assign Driver
            </Button>
            <Button
              variant="outlined"
              onClick={handleCloseDriverModal}
              style={{
                borderColor: "#4CAF50", // Green border for Cancel
                color: "#4CAF50", // Green text
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this jeep?"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Plate Number: {selectedJeep?.plateNumber}
          </Typography>          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} style={{
                borderColor: "#4CAF50", // Green border for Cancel
                color: "#4CAF50", // Green text
              }}>
            Cancel
          </Button>
          <Button onClick={handleDelete}  style={{
                backgroundColor: "#4CAF50", // Green background for Assign Driver
                color: "#fff", // White text
              }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Error */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          style: { backgroundColor: "#4CAF50", color: "white" }, // Green for success
        }}
      />

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          style: { backgroundColor: "#C80815", color: "white" }, // Red for error
        }}
      />
    </Box>
  );
}

export default Jeeps;
