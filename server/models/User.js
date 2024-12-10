const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    UserId: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    Salt: { type: String, required: false },
    email: { type: String, required: true },
    userRole: { 
      type: String, 
      enum: ['admin', null], // Define valid roles
      default: null 
    },
  },
  { collection: 'users-db' }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
