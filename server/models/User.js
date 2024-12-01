const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    UserId: { type: Number, required: true, unique: true },
    Password: { type: String, required: true },
    Salt: { type: String, required: true },
    Email: { type: String, required: true },
    userRole: { 
      type: String, 
      enum: ['admin', 'manager'], // Define valid roles
      required: true 
    },
  },
  { collection: 'users-db' }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
