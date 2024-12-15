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
import { Edit, Delete, Add, Search, Notifications } from "@mui/icons-material";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { useNotification } from "./Notification";

const API_BASE_URL = "https://jeep-ps.onrender.com";

function Drivers() {
  const [openModal, setOpenModal] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    licenseNo: "",
    licenseExpiryDate: "",
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
  const [licenseExpiryNotifications, setLicenseExpiryNotifications] = useState([]); // State for notifications
   const { notificationDots, setNotificationDots } = useNotification();
  const [isNotificationDotVisible, setNotificationDotVisible] = useState(false); // Dot indicator

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/driver-data/drivers`);
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
        licenseExpiryDate: driver.licenseExpiryDate || "",
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
      licenseExpiryDate: "",
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

  const checkLicenseExpiryNotifications = () => {
    const today = new Date();
    const twoMonthsFromToday = new Date();
    twoMonthsFromToday.setMonth(today.getMonth() + 2);

    const notifications = drivers.filter((driver) => {
      const expiryDate = new Date(driver.licenseExpiryDate);
      return expiryDate > today && expiryDate <= twoMonthsFromToday;
    });

    setLicenseExpiryNotifications(notifications);
    setNotificationDots((prev) => ({
      ...prev,
      driver: notifications.length > 0,
    }));
  };

  useEffect(() => {
    checkLicenseExpiryNotifications();
  }, [drivers]);

  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
    setOpenSnackbar(true);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
    formDataToSend.append("licenseExpiryDate", formData.licenseExpiryDate);
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
        const jeepsWithDriver = await axios.get(
          `${API_BASE_URL}/jeep-data/jeeps`
        );

        // Find all jeeps that have the driver assigned
        const jeepsToUpdate = jeepsWithDriver.data.filter(
          (jeep) => jeep.assignedDriver === name
        );

        // If there are any jeeps with the assigned driver, clear them
        if (jeepsToUpdate.length > 0) {
          // Loop through each jeep and clear the assigned driver
          for (const jeep of jeepsToUpdate) {
            await axios.put(
              `${API_BASE_URL}/jeep-data/updateVehicle/${jeep.plateNumber}`,
              {
                assignedDriver: null, // Clear the assigned driver
              }
            );
          }
        }

        await axios.delete(
          `${API_BASE_URL}/driver-data/delete-driver/${driverId}`
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
    { field: "licenseNo", headerName: "License No.", width: 130 },
    {
      field: "licenseExpiryDate",
      headerName: "License Expiry (DD/MM/YYYY)",
      width: 225,
      renderCell: (params) => {
        const date = new Date(params.row.licenseExpiryDate);
        const formattedDate = new Intl.DateTimeFormat("en-GB").format(date); // en-GB for dd/mm/yyyy format
        return (
          <Typography
            sx={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            {formattedDate}
          </Typography>
        );
      },
    },
    { field: "contact", headerName: "Contact", width: 150 },
    { field: "address", headerName: "Address", width: 325 },
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
        Driver Management
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
          <Tooltip title="Driver Notifications">
            <IconButton>
              <Notifications
                color={isNotificationDotVisible ? "error" : "default"}
              />
            </IconButton>
          </Tooltip>
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
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={alertMessage.type}>
          {alertMessage.message}
        </Alert>
      </Snackbar>

      {/* Notifications Alert */}
      {licenseExpiryNotifications.map((driver) => (
        <Snackbar
          open={true}
          autoHideDuration={8000}
          key={driver._id}
          message={`Driver ${driver.name}'s license will expire soon!`}
        />
      ))}
    </Box>
  );
}

export default Drivers;
