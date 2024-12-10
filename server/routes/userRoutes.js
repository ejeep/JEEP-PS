const express = require('express');
const {
  viewUsers,
  addUser,
  editUser,
  deleteUser,
  loginUser,
} = require('../controllers/userController');

const router = express.Router();

// Define routes
router.get('/viewUsers', viewUsers);
router.post('/addUser', addUser);
router.put('/editUser/:id', editUser);
router.delete('/deleteUser/:id', deleteUser);
router.post('/login', loginUser);

module.exports = router;
