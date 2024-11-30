import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, TextField, Box, Typography, Button } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Import icons
import { sha256 } from 'js-sha256'; // Import js-sha256 for password hashing
import './AdminSettings.css';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const AdminSettings = () => {
    const [users, setUsers] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3004/viewUsers'); // Update to the correct port
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const hashPassword = (password) => {
        return sha256(password); // Hash the password using js-sha256
    };

    const generateUserId = () => {
        return users.length + 1;
    };

    const handleAddUser = async () => {
        const { username, email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const hashedPassword = hashPassword(password); // Hash the password before sending to the server

        try {
            await axios.post('http://localhost:3004/addUser', {
                UserId: generateUserId(),
                Username: username,
                Email: email,
                Password: hashedPassword, 
            });
            fetchUsers();
            setIsAddModalOpen(false);
            setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    const handleEditUser = async () => {
        const { username, email, password } = formData;
        const hashedPassword = password ? hashPassword(password) : '';

        try {
            await axios.put(`http://localhost:3004/editUser/${selectedUser._id}`, {
                Username: username,
                Email: email,
                Password: hashedPassword || selectedUser.Password,
            });
            fetchUsers();
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error editing user:", error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            await axios.delete(`http://localhost:3004/deleteUser/${selectedUser._id}`);
            fetchUsers();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setFormData({
            username: user.Username,
            email: user.Email,
            password: '',
            confirmPassword: '',
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
            <Typography variant="h4" sx={{ mb: 2 }}>Admin Settings</Typography>
            <Button
                variant="contained"
                onClick={() => setIsAddModalOpen(true)}
                style={{ backgroundColor: '#4CAF50' }}
            >
                <b>+ ADD USER</b>
            </Button>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead style={{ backgroundColor: '#4CAF50'}}>
                        <TableRow>
                            <TableCell style={{ color: 'white'}}><b>User ID</b></TableCell>
                            <TableCell style={{ color: 'white'}}><b>Username</b></TableCell>
                            <TableCell style={{ color: 'white'}}><b>Email</b></TableCell>
                            <TableCell style={{ color: 'white'}}><b>Password</b></TableCell>
                            <TableCell style={{ color: 'white'}}><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.UserId}</TableCell>
                                <TableCell>{user.Username}</TableCell>
                                <TableCell>{user.Email}</TableCell>
                                <TableCell style={{
                                    maxWidth: '150px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'auto',
                                    textOverflow: 'ellipsis',
                                }}>
                                    {'●'.repeat(user.Password.length)}
                                </TableCell>

                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add User Modal */}
            <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">Add User</Typography>
                    <TextField
                        label="Username"
                        fullWidth
                        value={formData.username}
                        name="username"
                        onChange={handleInputChange}
                        sx={{ mt: 2 }}
                    />
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
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        value={formData.password}
                        name="password"
                        onChange={handleInputChange}
                        sx={{ mt: 2 }}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={togglePasswordVisibility}
                                    edge="end"
                                    sx={{ ml: 1 }}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ),
                        }}
                    />
                    <TextField
                        label="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        value={formData.confirmPassword}
                        name="confirmPassword"
                        onChange={handleInputChange}
                        sx={{ mt: 2 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button
                            variant="contained"
                            onClick={handleAddUser}
                            sx={{ backgroundColor: '#4CAF50', fontWeight: 'bold' }}
                        >
                            SAVE
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Edit User Modal */}
            <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">Edit User</Typography>
                    <TextField
                        label="Username"
                        fullWidth
                        value={formData.username}
                        name="username"
                        onChange={handleInputChange}
                        sx={{ mt: 2 }}
                    />
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
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        value={formData.password}
                        name="password"
                        onChange={handleInputChange}
                        sx={{ mt: 2 }}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={togglePasswordVisibility}
                                    edge="end"
                                    sx={{ ml: 1 }}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ),
                        }}
                    />
                    <TextField
                        label="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        value={formData.confirmPassword}
                        name="confirmPassword"
                        onChange={handleInputChange}
                        sx={{ mt: 2 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button
                            variant="contained"
                            onClick={handleEditUser}
                            sx={{ backgroundColor: '#4CAF50', fontWeight: 'bold' }}
                        >
                            SAVE
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Delete User Modal */}
            <Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">Delete User</Typography>
                    {selectedUser && (
                        <>
                            <TextField
                                label="Username"
                                fullWidth
                                value={selectedUser.Username}
                                InputProps={{ readOnly: true }}
                                sx={{ mt: 2 }}
                            />
                            <TextField
                                label="Email"
                                fullWidth
                                value={selectedUser.Email}
                                InputProps={{ readOnly: true }}
                                sx={{ mt: 2 }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleDeleteUser}
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    DELETE
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default AdminSettings;