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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "axios"; // Import Axios for API requests
import "./Drivers.css";

function Drivers() {
  const [openModal, setOpenModal] = useState(false);
  const [drivers, setDrivers] = useState([]); // State to store fetched driver data
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [formData, setFormData] = useState({
    id: "", // Add ID for editing drivers
    name: "",
    licenseNo: "",
    vehicleType: "",
    contact: "",
    address: "",
    documents: {
      licenseCopy: "",
      idCopy: "",
      proofOfResidency: "",
      insuranceCertificate: "",
    },
    status: "Active", // Default status
  });

  // Fetch drivers from the backend API when the component mounts
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get("http://localhost:3004/driver-data/drivers"); // Replace with your API endpoint
      setDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [name]: files[0] || null, // Allow empty file selection
      },
    }));
  };

  // Handle opening and closing the modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setFormData({
      id: "", // Reset ID when closing modal
      name: "",
      licenseNo: "",
      vehicleType: "",
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
    setOpenModal(false);
  };

  // Handle adding a new driver or updating an existing one
  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("licenseNo", formData.licenseNo);
    formDataToSend.append("vehicleType", formData.vehicleType);
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("status", formData.status);
  
    const { licenseCopy, idCopy, proofOfResidency, insuranceCertificate } = formData.documents;
  
    if (licenseCopy) formDataToSend.append("licenseCopy", licenseCopy);
    if (idCopy) formDataToSend.append("idCopy", idCopy);
    if (proofOfResidency) formDataToSend.append("proofOfResidency", proofOfResidency);
    if (insuranceCertificate) formDataToSend.append("insuranceCertificate", insuranceCertificate);

    try {
      if (formData.id) {
        // Update existing driver
        const response = await axios.put(
          `http://localhost:3004/driver-data/update-driver/${formData.id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Driver updated:", response.data);
      } else {
        // Add new driver
        const response = await axios.post(
          "http://localhost:3004/driver-data/add-drivers",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Driver added:", response.data);
      }

      // After successfully adding/updating the driver, fetch the updated drivers list
      await fetchDrivers();
      handleCloseModal();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Bad Request: Please check your inputs.");
      } else {
        alert("An error occurred while saving the driver. Please try again.");
      }
      console.error("Error saving driver:", error);
    }
  };

  // Function to handle editing a driver
  const handleEdit = (driver) => {
    setFormData({
      id: driver.id, // Set the driver ID
      name: driver.name,
      licenseNo: driver.licenseNo,
      vehicleType: driver.vehicleType,
      contact: driver.contact,
      address: driver.address,
      documents: {
        licenseCopy: null, // Reset files for editing
        idCopy: null,
        proofOfResidency: null,
        insuranceCertificate: null,
      },
      status: driver.status,
    });
    handleOpenModal();
  };

  // Handle deleting a driver
  const handleDelete = async (driverId) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        await axios.delete(`http://localhost:3004/driver-data/delete-driver/${driverId}`);
        // After successfully deleting the driver, fetch the updated drivers list
        await fetchDrivers();
      } catch (error) {
        console.error("Error deleting driver:", error);
        alert("An error occurred while deleting the driver. Please try again.");
      }
    }
  };

  // Filter drivers based on search term
  const filteredDrivers = drivers.filter((driver) => 
    (driver.name && typeof driver.name === 'string' && driver.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (driver.licenseNo && typeof driver.licenseNo === 'string' && driver.licenseNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (driver.vehicleType && typeof driver.vehicleType === 'string' && driver.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()))
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
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px" }}
      />

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={handleOpenModal}
        style={{ marginBottom: "20px", backgroundColor: "#4CAF50", color: "#fff" }}
      >
        Add Driver
      </Button>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>License No.</TableCell>
              <TableCell>Vehicle Type</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDrivers.map((driver, index) => (
              <TableRow key={index}>
                <TableCell>{driver.name}</TableCell>
                <TableCell>{driver.licenseNo}</TableCell>
                <TableCell>{driver.vehicleType}</TableCell>
                <TableCell>{driver.contact}</TableCell>
                <TableCell>{driver.address}</TableCell>
                <TableCell>{driver.status}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(driver)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(driver.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={handleCloseModal}>
        <div className="modal-overlay">
          <Box className="modal-box">
            <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', overflowY: 'auto', maxHeight: '80vh' }}>
            <Typography variant="h6" gutterBottom>
              {formData.id ? "Edit Driver" : "Add Driver"} {/* Update modal title based on operation */}
            </Typography>
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
                  label="Vehicle Type"
                  variant="outlined"
                  fullWidth
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
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
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Upload Documents
                </Typography>
                <TextField
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  name="licenseCopy"
                  onChange={handleFileChange}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  name="idCopy"
                  onChange={handleFileChange}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  name="proofOfResidency"
                  onChange={handleFileChange}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  name="insuranceCertificate"
                  onChange={handleFileChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Box mt={2}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                {formData.id ? "Update Driver" : "Add Driver"} {/* Update button text based on operation */}
              </Button>
              <Button variant="contained" color="secondary" onClick={handleCloseModal} style={{ marginLeft: "10px" }}>
                Cancel
              </Button>
            </Box>
            </div>
            
          </Box>
        </div>
      </Modal>
    </Box>
  );
}

export default Drivers;
