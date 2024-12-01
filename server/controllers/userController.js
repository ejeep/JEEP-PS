const crypto = require('crypto');
const User = require('../models/User');

// Hash function using SHA256
const sha256 = (data) => crypto.createHash('sha256').update(data).digest('hex');

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
  console.log("Request Body:", req.body);  // Log the entire body

  const { Email, Password, userRole } = req.body;
  console.log("Received User Role:", userRole);

  if (!['admin', 'manager'].includes(userRole)) {
    return res.status(400).json({ error: 'Invalid user role.' });
  }

  // Generate random salt
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = sha256(Password + salt);

  try {
    const userCount = await User.countDocuments();
    const newUserId = userCount + 1;

    const newUser = new User({
      UserId: newUserId,
      Email,
      Password: hashedPassword,
      Salt: salt,
      userRole,
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
  const { Email, Password, userRole } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const salt = user.Salt;
    const hashedPassword = Password ? sha256(Password + salt) : user.Password;

    if (userRole && !['admin', 'manager'].includes(userRole)) {
      return res.status(400).json({ error: 'Invalid user role.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { Email, Password: hashedPassword, userRole },
      { new: true }
    );

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


module.exports = {
  viewUsers,
  addUser,
  editUser,
  deleteUser,
};
