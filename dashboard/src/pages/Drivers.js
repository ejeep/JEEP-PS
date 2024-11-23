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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "axios";

function Drivers() {
  const [openModal, setOpenModal] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get("http://localhost:3004/driver-data/drivers");
      setDrivers(Array.isArray(response.data) ? response.data : []); // Ensure it's an array
    } catch (error) {
      showAlert("error", "Failed to fetch drivers. Please try again.");
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        showAlert(
          "error",
          "Invalid file type. Only PDF, JPEG, and PNG are allowed."
        );
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        showAlert("error", "File size exceeds 2MB limit.");
        return;
      }
      setFormData((prevState) => ({
        ...prevState,
        documents: {
          ...prevState.documents,
          [name]: file,
        },
      }));
    }
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

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.licenseNo ||
      !formData.contact ||
      !formData.address
    ) {
      showAlert("error", "All fields are required.");
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
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
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

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Manage Drivers
      </Typography>
      <TextField
        label="Search Drivers"
        variant="outlined"
        fullWidth
        value={searchTerm}
        // onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Button
        variant="contained"
        startIcon={<Add sx={{ color: "#fff" }} />} // Add icon with white color
        onClick={() => handleOpenModal()}
        sx={{ mb: 2 }}
        style={{
          backgroundColor: "#4CAF50", // Green background
          color: "#fff", // White text
        }}
      >
        Add Driver
      </Button>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>License No.</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
  {filteredDrivers.map((driver) => (
    <TableRow key={driver._id}>
      <TableCell>{driver.name}</TableCell>
      <TableCell>{driver.licenseNo}</TableCell>
      <TableCell>{driver.contact}</TableCell>
      <TableCell>{driver.address}</TableCell>
      <TableCell>{driver.status}</TableCell>
      <TableCell>
        <IconButton
          onClick={() => handleOpenModal(driver)}
          style={{ color: "#4CAF50" }}
        >
          <Edit />
        </IconButton>
        <IconButton
          onClick={() => handleDelete(driver._id)}
          style={{ color: "#4CAF50" }}
        >
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {selectedDriverId ? "Edit Driver" : "Add Driver"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="License No."
            name="licenseNo"
            value={formData.licenseNo}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
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
          <Typography variant="subtitle1" gutterBottom>
            Upload Documents:
          </Typography>
          {[
            "licenseCopy",
            "idCopy",
            "proofOfResidency",
            "insuranceCertificate",
          ].map((doc) => (
            <TextField
              key={doc}
              type="file"
              name={doc}
              onChange={handleFileChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            style={{
              borderColor: "#4CAF50", // Green border
              color: "#4CAF50", // Green text
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            style={{
              backgroundColor: "#4CAF50", // Green background
              color: "#fff", // White text
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={alertMessage.type}
          sx={{
            width: "100%",
            backgroundColor:
              alertMessage.type === "success" ? "#DFF2BF" : "#FFBABA", // Success: light green, Error: light red
            color: alertMessage.type === "success" ? "#4CAF50" : "#D8000C", // Text colors
          }}
        >
          {alertMessage.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Drivers;
