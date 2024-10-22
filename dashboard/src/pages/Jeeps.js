import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Modal,
  TextField,
  MenuItem,
  Snackbar,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "axios";
import "./Jeeps.css";

const API_BASE_URL = "http://localhost:3004";

function Jeeps() {
  const [openModal, setOpenModal] = useState(false);
  const [openDriverModal, setOpenDriverModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedJeep, setSelectedJeep] = useState(null);
  const [formData, setFormData] = useState({
    plateNumber: "",
    model: "",
    route: "",
    routeDirection: "North Bound",
  });
  const [jeeps, setJeeps] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchJeeps();
    fetchDrivers();
  }, []);

  const fetchJeeps = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jeep-data/jeeps`);
      setJeeps(response.data);
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
      route: "",
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/jeep-data/addVehicle`,
        formData
      );
      setJeeps([...jeeps, response.data]);
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
          route: formData.route,
          routeDirection: formData.routeDirection,
        }
      );

      const updatedJeep = response.data;
      setJeeps((prevJeeps) =>
        prevJeeps.map((jeep) =>
          jeep.plateNumber === updatedJeep.plateNumber ? updatedJeep : jeep
        )
      );
      handleCloseModal();
    } catch (error) {
      handleError("Error editing jeep");
    }
  };

  const handleDelete = async (jeep) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/jeep-data/deleteVehicle/${jeep.plateNumber}`
      );
      setJeeps((prevJeeps) =>
        prevJeeps.filter((j) => j.plateNumber !== jeep.plateNumber)
      );
    } catch (error) {
      handleError("Error deleting jeep");
    }
  };

  const handleAssignDriver = async (driver) => {
    if (!driver) return handleError("No driver selected");

    try {
      const response = await axios.put(
        `${API_BASE_URL}/jeep-data/updateVehicle/${selectedJeep.plateNumber}`,
        {
          model: selectedJeep.model,
          route: selectedJeep.route,
          routeDirection: selectedJeep.routeDirection,
          assignedDriver: driver.name,
        }
      );

      const updatedJeep = response.data;
      setJeeps((prevJeeps) =>
        prevJeeps.map((jeep) =>
          jeep.plateNumber === updatedJeep.plateNumber ? updatedJeep : jeep
        )
      );
      handleCloseDriverModal();
    } catch (error) {
      handleError("Error assigning driver");
    }
  };

  const handleOpenModalWithJeep = (jeep) => {
    setSelectedJeep(jeep);
    setFormData({
      plateNumber: jeep.plateNumber,
      model: jeep.model,
      route: jeep.route,
      routeDirection: jeep.routeDirection || "North Bound",
    });
    setIsEdit(true);
    setOpenModal(true);
  };

  const activeDrivers = drivers.filter((driver) => driver.status === "Active");

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Manage Jeeps
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          fullWidth
          sx={{ marginRight: "10px" }}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#4CAF50", color: "#fff" }}
        >
          Search
        </Button>
      </Box>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={handleOpenModal}
        style={{
          marginBottom: "20px",
          backgroundColor: "#4CAF50", // Green background
          color: "#fff", // White text
        }}
      >
        Add Jeep
      </Button>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Plate Number</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Assigned Driver</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jeeps.map((jeep) => (
              <TableRow key={jeep.plateNumber}>
                <TableCell>{jeep.plateNumber}</TableCell>
                <TableCell>{jeep.model}</TableCell>
                <TableCell>
                  {jeep.routeDirection}: {jeep.route}
                </TableCell>
                <TableCell>{jeep.assignedDriver || "None"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenModalWithJeep(jeep)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(jeep)}
                    style={{ color: "#4CAF50" }} // Green text for delete
                  >
                    <Delete />
                  </IconButton>
                  <Button
  variant="outlined" // Change to outlined to match theme
  onClick={() => handleOpenDriverModal(jeep)}
  style={{
    borderColor: "#4CAF50", // Green border
    color: "#4CAF50", // Green text
  }}
>
  Assign Driver
</Button>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for adding/editing a jeep */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            padding: 2,
            width: 400,
            margin: "auto",
            backgroundColor: "white",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">
            {isEdit ? "Edit Jeep" : "Add Jeep"}
          </Typography>
          <TextField
            label="Plate Number"
            value={formData.plateNumber}
            name="plateNumber"
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={isEdit}
          />
          <TextField
            label="Model"
            value={formData.model}
            name="model"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Route"
            value={formData.route}
            name="route"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Route Direction"
            value={formData.routeDirection}
            name="routeDirection"
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="North Bound">North Bound</MenuItem>
            <MenuItem value="South Bound">South Bound</MenuItem>
            <MenuItem value="East Bound">East Bound</MenuItem>
            <MenuItem value="West Bound">West Bound</MenuItem>
          </TextField>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={isEdit ? handleEdit : handleAdd}
            >
              {isEdit ? "Update" : "Add"}
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal for assigning driver */}
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
    <Typography variant="h6" sx={{ color: "#4CAF50" }}> {/* Green title */}
      Assign Driver to {selectedJeep?.plateNumber}
    </Typography>
    {activeDrivers.length > 0 ? (
      <TextField
        select
        label="Select Driver"
        onChange={(e) =>
          handleAssignDriver(
            drivers.find((driver) => driver.name === e.target.value)
          )
        }
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
      <Typography>No active drivers available.</Typography>
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
        onClick={() => handleAssignDriver(selectedJeep.assignedDriver)}
        style={{
          backgroundColor: "#4CAF50", // Green background for Assign Driver
          color: "#fff", // White text
        }}
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


      {/* Snackbar for error handling */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
      />
    </Box>
  );
}

export default Jeeps;
