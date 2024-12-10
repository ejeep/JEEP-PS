import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tooltip,
  CircularProgress,
  DialogContentText,
  DialogTitle as MuiDialogTitle,
} from "@mui/material";
import { Edit, Delete, Add, Search } from "@mui/icons-material";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

const API_BASE_URL = "http://localhost:3004";

function Drivers() {
  const [openModal, setOpenModal] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    licenseNo: "",
    licenseExpiryDate: "",  // Added field for license expiry date
    contact: "",
    address: "",
    documents: {
      licenseCopy: null,
      idCopy: null,
      proofOfResidency: null,
      insuranceCertificate: null,
    },
    status: "Active",
  });
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/driver-data/drivers`
      );
      setDrivers(response.data);
      setFilteredDrivers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      showAlert("error", "Failed to fetch drivers.");
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filtered = drivers.filter(
      (driver) =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.licenseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.contact.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDrivers(filtered);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOpenModal = (driver = null) => {
    if (driver) {
      setFormData({
        name: driver.name,
        licenseNo: driver.licenseNo,
        licenseExpiryDate: driver.licenseExpiryDate || "", // Handle the expiry date
        contact: driver.contact,
        address: driver.address,
        documents: driver.documents || {},
        status: driver.status,
      });
      setSelectedDriverId(driver._id);
    } else {
      resetForm();
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      licenseNo: "",
      licenseExpiryDate: "",  // Reset the expiry date
      contact: "",
      address: "",
      documents: {
        licenseCopy: null,
        idCopy: null,
      },
      status: "Active",
    });
    setSelectedDriverId(null);
  };

  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
    setOpenSnackbar(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation Rules
    const errors = [];
    if (!formData.name.trim()) {
      errors.push("Name is required.");
    }
    if (!formData.licenseNo.trim()) {
      errors.push("License number is required.");
    }
    if (!/^\d{10,11}$/.test(formData.contact)) {
      errors.push("Contact must be 10 or 11 digits long.");
    }
    if (!formData.address.trim()) {
      errors.push("Address is required.");
    }
    if (!formData.licenseExpiryDate.trim()) {
      errors.push("License expiry date is required.");
    }

    // Show errors if any
    if (errors.length > 0) {
      showAlert("error", errors.join(" "));
      return;
    }

    const isDuplicate = drivers.some(
      (driver) =>
        driver.licenseNo.toLowerCase() === formData.licenseNo.toLowerCase() &&
        driver._id !== selectedDriverId // Exclude the current driver being edited
    );

    if (isDuplicate) {
      showAlert("error", "This License Number already exists.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("licenseNo", formData.licenseNo);
    formDataToSend.append("licenseExpiryDate", formData.licenseExpiryDate); // Add expiry date to form data
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("status", formData.status);

    const { licenseCopy, idCopy } = formData.documents;
    if (licenseCopy) formDataToSend.append("licenseCopy", licenseCopy);
    if (idCopy) formDataToSend.append("idCopy", idCopy);

    try {
      if (selectedDriverId) {
        await axios.put(
          `${API_BASE_URL}/driver-data/update-driver/${selectedDriverId}`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        showAlert("success", "Driver updated successfully.");
      } else {
        await axios.post(
          `${API_BASE_URL}/driver-data/add-drivers`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        showAlert("success", "Driver added successfully.");
      }
      fetchDrivers();
      handleCloseModal();
    } catch (error) {
      showAlert("error", "An error occurred. Please try again.");
    }
  };

  const handleDelete = async (name, driverId) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        const jeepsWithDriver = await axios.get(`${API_BASE_URL}/jeep-data/jeeps`);

        // Find all jeeps that have the driver assigned
        const jeepsToUpdate = jeepsWithDriver.data.filter(
          (jeep) => jeep.assignedDriver === name
        );

        // If there are any jeeps with the assigned driver, clear them
        if (jeepsToUpdate.length > 0) {
          // Loop through each jeep and clear the assigned driver
          for (const jeep of jeepsToUpdate) {
            await axios.put(`${API_BASE_URL}/jeep-data/updateVehicle/${jeep.plateNumber}`, {
              assignedDriver: null,  // Clear the assigned driver
            });
          }
        }

        await axios.delete(`${API_BASE_URL}/driver-data/delete-driver/${driverId}`);
        showAlert("success", "Driver deleted successfully.");
        fetchDrivers();
      } catch (error) {
        showAlert("error", "Failed to delete driver. Please try again.");
      }
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData((prevState) => ({
        ...prevState,
        documents: {
          ...prevState.documents,
          [name]: file,
        },
      }));
    }
  };

  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "licenseNo", headerName: "License No.", width: 180 },
    { field: "licenseExpiryDate", headerName: "License Expiry", width: 180 }, // Display expiry date in the grid
    { field: "contact", headerName: "Contact", width: 180 },
    { field: "address", headerName: "Address", width: 450 },
    { field: "status", headerName: "Status", width: 125 },
    {
      field: "actions",
      headerName: "Actions",
      width: 125,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => handleOpenModal(params.row)}
              style={{ color: "#4CAF50" }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDelete(params.row.name, params.row._id)}
              style={{ color: "#f44336" }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Drivers
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
        startIcon={<Add />}
      >
        Add Driver
      </Button>
      <Box sx={{ my: 3 }}>
        <TextField
          label="Search by Name, License No., or Contact"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={handleSearch}
          fullWidth
        />
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid rows={filteredDrivers} columns={columns} pageSize={5} />
        </div>
      )}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <MuiDialogTitle>Driver Information</MuiDialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="License No."
                variant="outlined"
                fullWidth
                name="licenseNo"
                value={formData.licenseNo}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="License Expiry Date"
                variant="outlined"
                type="date"
                fullWidth
                name="licenseExpiryDate"
                value={formData.licenseExpiryDate}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contact"
                variant="outlined"
                fullWidth
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                variant="outlined"
                fullWidth
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Grid>
            {/* Add file upload buttons for documents */}
            <Grid item xs={12}>
              <input
                accept="image/*,application/pdf"
                type="file"
                name="licenseCopy"
                onChange={handleFileChange}
                id="licenseCopy"
              />
              <Button variant="contained" color="secondary">
                Upload License Copy
              </Button>
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*,application/pdf"
                type="file"
                name="idCopy"
                onChange={handleFileChange}
                id="idCopy"
              />
              <Button variant="contained" color="secondary">
                Upload ID Copy
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={alertMessage.type} onClose={() => setOpenSnackbar(false)}>
          {alertMessage.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Drivers;
