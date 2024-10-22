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
    status: "Active", // Default status
  });

  const [selectedDriverId, setSelectedDriverId] = useState(null); // State for selected driver ID

  // Fetch drivers from the backend API when the component mounts
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3004/driver-data/drivers"
      ); // Replace with your API endpoint
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

  // Handle opening and closing the modal
  const handleOpenModal = (driver = null) => {
    if (driver) {
      // If editing a driver, populate form with driver data
      setFormData({
        name: driver.name,
        licenseNo: driver.licenseNo,
        contact: driver.contact,
        address: driver.address,
        documents: driver.documents || {
          licenseCopy: null,
          idCopy: null,
          proofOfResidency: null,
          insuranceCertificate: null,
        },
        status: driver.status,
      });
      setSelectedDriverId(driver._id); // Set selected driver ID for updating
    } else {
      // Reset form for adding new driver
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
      setSelectedDriverId(null); // Reset selected driver ID
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  // Handle adding or updating a driver
  const handleSubmit = async () => {
    const formDataToSend = new FormData();

    // Append regular fields to formData
    formDataToSend.append("name", formData.name);
    formDataToSend.append("licenseNo", formData.licenseNo);
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("status", formData.status);

    // Handling document uploads, ensuring only files are sent
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
        // Update driver
        const response = await axios.put(
          `http://localhost:3004/driver-data/update-driver/${selectedDriverId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
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
      }

      // After successfully adding/updating the driver, fetch the updated drivers list
      await fetchDrivers(); // Call the function to get the updated list of drivers

      // Close the modal after successful submission
      handleCloseModal();

      // Reset form
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
      setSelectedDriverId(null); // Reset selected driver ID
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Bad Request: Please check your inputs.");
      } else {
        alert(
          "An error occurred while adding/updating the driver. Please try again."
        );
      }
      console.error("Error adding/updating driver:", error);
    }
  };

  // Handle deleting a driver
  const handleDelete = async (driverId) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        await axios.delete(
          `http://localhost:3004/driver-data/delete-driver/${driverId}`
        );
        // After successfully deleting the driver, fetch the updated drivers list
        await fetchDrivers(); // Call the function to get the updated list of drivers
      } catch (error) {
        alert("An error occurred while deleting the driver. Please try again.");
        console.error("Error deleting driver:", error);
      }
    }
  };

  // Filter drivers based on search term
  const filteredDrivers = drivers.filter(
    (driver) =>
      (driver.name &&
        typeof driver.name === "string" &&
        driver.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (driver.licenseNo &&
        typeof driver.licenseNo === "string" &&
        driver.licenseNo.toLowerCase().includes(searchTerm.toLowerCase()))
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
        onClick={() => handleOpenModal()} // Open modal for adding driver
        style={{
          marginBottom: "20px",
          backgroundColor: "#4CAF50",
          color: "#fff",
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
                    style={{ color: "#4CAF50" }}
                    onClick={() => handleOpenModal(driver)} // Open modal for editing driver
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                     style={{ color: "#4CAF50" }}
                    onClick={() => handleDelete(driver._id)} // Handle driver deletion
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Adding/Editing Driver */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            width: 400,
            maxHeight: "80vh", // Limit the height to 80% of the viewport height
            padding: 4,
            backgroundColor: "white",
            margin: "auto",
            overflowY: "auto", // Enable scrolling
            marginTop: "2%",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {selectedDriverId ? "Edit Driver" : "Add Driver"}
          </Typography>

          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            style={{ marginBottom: "16px" }}
            required
          />
          <TextField
            label="License No."
            name="licenseNo"
            value={formData.licenseNo}
            onChange={handleChange}
            fullWidth
            style={{ marginBottom: "16px" }}
            required
          />

          <TextField
            label="Contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            fullWidth
            style={{ marginBottom: "16px" }}
            required
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            style={{ marginBottom: "16px" }}
            required
          />
          <FormControl fullWidth style={{ marginBottom: "16px" }}>
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
          <TextField
            type="file"
            name="licenseCopy"
            onChange={handleFileChange}
            style={{ marginBottom: "8px" }}
          />
          <TextField
            type="file"
            name="idCopy"
            onChange={handleFileChange}
            style={{ marginBottom: "8px" }}
          />
          <TextField
            type="file"
            name="proofOfResidency"
            onChange={handleFileChange}
            style={{ marginBottom: "8px" }}
          />
          <TextField
            type="file"
            name="insuranceCertificate"
            onChange={handleFileChange}
            style={{ marginBottom: "16px" }}
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            style={{
              marginBottom: "20px",
              backgroundColor: "#4CAF50",
              color: "#fff",
            }}
          >
            {selectedDriverId ? "Update Driver" : "Add Driver"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default Drivers;
