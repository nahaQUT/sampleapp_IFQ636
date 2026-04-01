const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected...');

        const users = await User.find({}, 'name email role');
        console.log('All users:');
        users.forEach(user => {
            console.log(`Name: ${user.name} | Email: ${user.email} | Role: ${user.role}`);
        });

        process.exit();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

checkUsers();