const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected...');

        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@podkas.com' });
        if (adminExists) {
            console.log('Admin account already exists!');
            process.exit();
        }

        // Create admin account
        await User.create({
            name: 'Admin',
            email: 'admin@podkas.com',
            password: 'Admin1234!',
            role: 'admin',
        });

        console.log('Admin account created successfully!');
        console.log('Email: admin@podkas.com');
        console.log('Password: Admin1234!');
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();