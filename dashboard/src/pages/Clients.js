// src/pages/Clients.js
import React, { useState } from "react";
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
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import "./Clients.css";

const coopData = [
  {
    name: "First Novo Vizcayano Travellers Transport Cooperative",
    area: "North Luzon",
    region: "Region 2",
    province: "Nueva Vizcaya",
    city: "Bayombong",
    address: "123 Main St., Bayombong, Nueva Vizcaya",
  },
  // Add more data as needed...
];

function Clients() {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    area: "",
    region: "",
    province: "",
    city: "",
    address: "",
  });

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    // Add your add logic here
    console.log("Adding COOP User:", formData);
    handleCloseModal();
  };

  return (
    <Box sx={{ padding: 4 }}>
  <Typography variant="h4" gutterBottom align="center">
    Manage COOP Users
  </Typography>

  {/* Search bar and button */}
  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
    <TextField
      variant="outlined"
      placeholder="Search..."
      fullWidth
      sx={{ marginRight: '10px' }}
    />
    <Button variant="contained" style={{ backgroundColor: "#4CAF50", color: "#fff" }}>
      Search
    </Button>
  </Box>

  <Button
    variant="contained"
    startIcon={<Add />}
    onClick={handleOpenModal}
    style={{ marginBottom: "20px", backgroundColor: "#4CAF50", color: "#fff" }}
  >
    Add COOP User
  </Button>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transport Cooperative Name</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Province/Sector</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coopData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.area}</TableCell>
                <TableCell>{row.region}</TableCell>
                <TableCell>{row.province}</TableCell>
                <TableCell>{row.city}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary">
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
      <Typography variant="h6" gutterBottom>
        Add COOP User
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Transport Cooperative Name"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Area</InputLabel>
            <Select
              name="area"
              value={formData.area}
              onChange={handleChange}
            >
              <MenuItem value="North Luzon">North Luzon</MenuItem>
              <MenuItem value="South Luzon">South Luzon</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Region</InputLabel>
            <Select
              name="region"
              value={formData.region}
              onChange={handleChange}
            >
              <MenuItem value="Region 1">Region 1</MenuItem>
              <MenuItem value="Region 2">Region 2</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Province/Sector"
            fullWidth
            name="province"
            value={formData.province}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="City"
            fullWidth
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address"
            fullWidth
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
            variant="contained"
            style={{ backgroundColor: "#4CAF50", color: "#fff" }}  // Add button (green)
            onClick={handleAdd}
        >
            Add
        </Button>
        <Button
            variant="contained"
            style={{ backgroundColor: "#f44336", color: "#fff" }}  // Close button (red)
            onClick={handleCloseModal}
        >
            Close
        </Button>
        </Grid>

      </Grid>
    </Box>
  </div>
</Modal>

    </Box>
  );
}

export default Clients;
