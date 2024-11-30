const express = require('express');
const {
  viewUsers,
  addUser,
  editUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

// Define routes
router.get('/viewUsers', viewUsers);
router.post('/addUser', addUser);
router.put('/editUser/:id', editUser);
router.delete('/deleteUser/:id', deleteUser);

module.exports = router;
