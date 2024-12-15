import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  Box,
  Typography,
  Button,
  MenuItem,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // password visibility icons
import { sha256 } from "js-sha256"; // For password hashing
import "./AdminSettings.css";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AdminSettings = () => {
  const [users, setUsers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userRole: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    password: "",
    userRole: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://jeep-ps.onrender.com/users/viewUsers");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const hashPassword = (password) => sha256(password);

  const validateForm = () => {
    let errors = {};
    const { password, userRole } = formData;

    if (password && password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    if (!userRole && formData.userRole !== "") {
      errors.userRole = "User role cannot be empty.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleAddUser = async () => {
    const { email, password, confirmPassword, userRole } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!validateForm()) {
      return;
    }

    const hashedPassword = hashPassword(password);
    const normalizedRole = userRole ? userRole.toLowerCase() : null; // Nullable role

    try {
      const response = await axios.post(
        "https://jeep-ps.onrender.com/users/addUser",
        {
          email: email,
          password: hashedPassword,
          userRole: normalizedRole,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      fetchUsers();
      setIsAddModalOpen(false);
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        userRole: "",
      });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleEditUser = async () => {
    const { email, password, userRole } = formData;
  
    if (password && password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
  
    const hashedPassword = password ? hashPassword(password) : "";
  
    try {
      await axios.put(
        `https://jeep-ps.onrender.com/users/editUser/${selectedUser._id}`,
        {
          email: email,
          password: hashedPassword || selectedUser.password,
          userRole: userRole ? userRole.toLowerCase() : selectedUser.userRole.toLowerCase(), // Ensure userRole is lowercase
        }
      );
      fetchUsers();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };
  

  const handleDeleteUser = async () => {
    try {
      await axios.delete(
        `https://jeep-ps.onrender.com/users/deleteUser/${selectedUser._id}`
      );
      fetchUsers();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: "",
      confirmPassword: "",
      userRole: user.UserRole || "",
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Admin Settings
      </Typography>
      {/* <Button
        variant="contained"
        onClick={() => setIsAddModalOpen(true)}
        style={{ backgroundColor: "#4CAF50" }}
      >
        <b>+ ADD USER</b>
      </Button> */}

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead style={{ backgroundColor: "#4CAF50" }}>
            <TableRow>
              <TableCell style={{ color: "white" }}>
                <b>User ID</b>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <b>Email</b>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <b>User Role</b>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <b>Password</b>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.UserId}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.userRole}</TableCell>
                <TableCell
                  style={{
                    maxWidth: "150px",
                    whiteSpace: "nowrap",
                    overflow: "auto",
                    textOverflow: "ellipsis",
                  }}
                >
                  {"●".repeat(user.password.length)}
                </TableCell>

                <TableCell>
                  <IconButton onClick={() => handleEditClick(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(user)}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add User Modal */}
      <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Add User</Typography>
          <TextField
            label="Email"
            fullWidth
            value={formData.email}
            name="email"
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={formData.password}
            name="password"
            onChange={handleInputChange}
            sx={{ mt: 2 }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={togglePasswordVisibility}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          {formErrors.password && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {formErrors.password}
            </Typography>
          )}
          <TextField
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={formData.confirmPassword}
            name="confirmPassword"
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
          <TextField
            label="User Role"
            fullWidth
            select
            value={formData.userRole}
            name="userRole"
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          >
            <MenuItem value="">None</MenuItem> {/* Allow clearing the role */}
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
          {formErrors.userRole && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {formErrors.userRole}
            </Typography>
          )}
          <Button
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#4CAF50", // Green background
              color: "#fff",
            }}
            onClick={handleAddUser}
          >
            Add User
          </Button>
        </Box>
      </Modal>

      {/* Edit User Modal */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Edit User</Typography>
          <TextField
            label="Email"
            fullWidth
            value={formData.email}
            name="email"
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={formData.password}
            name="password"
            onChange={handleInputChange}
            sx={{ mt: 2 }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={togglePasswordVisibility}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          {formErrors.password && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {formErrors.password}
            </Typography>
          )}
          <TextField
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={formData.confirmPassword}
            name="confirmPassword"
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
          <TextField
            label="User Role"
            fullWidth
            select
            value={formData.userRole}
            name="userRole"
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          >
            <MenuItem value="">None</MenuItem> {/* Allow clearing the role */}
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
          {formErrors.userRole && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {formErrors.userRole}
            </Typography>
          )}
          <Button
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#4CAF50", // Green background
              color: "#fff",
            }}
            onClick={handleEditUser}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6">Delete User</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Are you sure you want to delete this user?
          </Typography>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteUser}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminSettings;
