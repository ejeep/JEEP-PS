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

function Drivers() {
  const [openModal, setOpenModal] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    licenseNo: "",
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
        "http://localhost:3004/driver-data/drivers"
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
    setSelectedDriverId(null);
  };

  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
    setOpenSnackbar(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !formData.name ||
      !formData.licenseNo ||
      !formData.contact ||
      !formData.address
    ) {
      showAlert("error", "All fields are required.");
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
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("status", formData.status);

    const { licenseCopy, idCopy, proofOfResidency, insuranceCertificate } =
      formData.documents;
    if (licenseCopy) formDataToSend.append("licenseCopy", licenseCopy);
    if (idCopy) formDataToSend.append("idCopy", idCopy);
    if (proofOfResidency)
      formDataToSend.append("proofOfResidency", proofOfResidency);
    if (insuranceCertificate)
      formDataToSend.append("insuranceCertificate", insuranceCertificate);

    try {
      if (selectedDriverId) {
        await axios.put(
          `http://localhost:3004/driver-data/update-driver/${selectedDriverId}`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        showAlert("success", "Driver updated successfully.");
      } else {
        await axios.post(
          "http://localhost:3004/driver-data/add-drivers",
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

  const handleDelete = async (driverId) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        await axios.delete(
          `http://localhost:3004/driver-data/delete-driver/${driverId}`
        );
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
              onClick={() => handleDelete(params.row._id)}
              style={{ color: "#4CAF50" }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Manage Drivers
      </Typography>

      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Button
            variant="contained"
            startIcon={<Add sx={{ color: "#fff" }} />}
            onClick={() => handleOpenModal()}
            sx={{ mb: 2 }}
            style={{
              backgroundColor: "#4CAF50", // Green background
              color: "#fff", // White text
            }}
          >
            Add Driver
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
          rows={filteredDrivers}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row._id}
          disableSelectionOnClick
          loading={loading}
        />
      </Paper>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {selectedDriverId ? "Edit Driver" : "Add Driver"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Driver Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="License No."
              name="licenseNo"
              value={formData.licenseNo}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              label="License Copy"
              name="licenseCopy"
              type="file"
              onChange={handleFileChange}
              fullWidth
            />
            <TextField
              label="ID Copy"
              name="idCopy"
              type="file"
              onChange={handleFileChange}
              fullWidth
            />
            <TextField
              label="Proof of Residency"
              name="proofOfResidency"
              type="file"
              onChange={handleFileChange}
              fullWidth
            />
            <TextField
              label="Insurance Certificate"
              name="insuranceCertificate"
              type="file"
              onChange={handleFileChange}
              fullWidth
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>

            <DialogActions>
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
                type="submit"
                style={{
                  width: "48%",
                  backgroundColor: "#4CAF50", // Green background
                  color: "#fff",
                }}
              >
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={alertMessage.type}
        >
          {alertMessage.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Drivers;
