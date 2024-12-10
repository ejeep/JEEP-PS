const bcrypt = require('bcrypt');

const User = require('../models/User');
const jwt = require('jsonwebtoken');


// View Users
const viewUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Add User
const addUser = async (req, res) => {
  console.log("Request Body:", req.body); // Log the entire body

  const { email, password, userRole } = req.body;
  console.log("Received User Role:", userRole);

  // Trim email and validate email format
  const trimmedEmail = email.trim();

  if (!trimmedEmail || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    // Hash the password directly (salt is handled internally by bcrypt)
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    // Create a new user
    const userCount = await User.countDocuments();
    const newUserId = userCount + 1;

    // Handle the case where `userRole` is not provided or is null
    const finalUserRole = userRole && ['admin'].includes(userRole) ? userRole : null;

    const newUser = new User({
      UserId: newUserId,
      email: trimmedEmail,
      password: hashedPassword, // Store only the hash
      userRole: finalUserRole,
    });

    await newUser.save();
    res.json({ success: true, message: 'User added successfully!' });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Edit User
const editUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, userRole } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updates = {};
    if (email) updates.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updates.password = hashedPassword;
    }
    if (userRole && !['admin'].includes(userRole)) {
      return res.status(400).json({ error: 'Invalid user role.' });
    }
    if (userRole) updates.userRole = userRole;

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    res.json({ success: true, message: 'User updated successfully!', updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully!' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const loginUser = async (req, res) => {
  console.log('Login request body:', req.body); // Debug email and password

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    

    // Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Respond with user data (excluding sensitive information like password)
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        email: user.email,
        userRole: user.userRole,
        userId: user.UserId,
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  viewUsers,
  addUser,
  editUser,
  deleteUser,
  loginUser,
};
