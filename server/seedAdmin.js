const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust the path as needed
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Jeep-PS:bdgVmQbzmPRn1FBr@jeepps.mwxa4.mongodb.net/?retryWrites=true&w=majority&appName=JeepPS';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Create an array of users to be added (admin + 2 regular users)
    const users = [
      {
        email: 'ejeepps@gmail.com',
        password: 'ejeepps',  // Example password for admin
        role: 'admin',
        userId: '1'
      },
      {
        email: 'board1@example.com',
        password: 'user1password',  // Example password for regular user 1
        role: 'admin',
        userId: '2'
      },
      {
        email: 'board2@example.com',
        password: 'user2password',  // Example password for regular user 2
        role: 'admin',
        userId: '3'
      }
    ];

    // Loop through each user, hash the password, and create the user
    for (let user of users) {
      const existingUser = await User.findOne({ email: user.email });

      if (existingUser) {
        console.log(`User with email ${user.email} already exists`);
        continue; // Skip to the next user if the user already exists
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);

      const newUser = new User({
        userRole: user.role,
        email: user.email,
        password: hashedPassword,
        Salt: hashedPassword,  // If your schema requires a salt, you may need to store it
        UserId: user.userId,
      });

      // Save the user to the database
      await newUser.save();
      console.log(`${user.role} user created successfully: ${user.email}`);
    }

    process.exit();
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

connectToDatabase();
