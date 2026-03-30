const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const fixRoles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected...');

        // Set all users without a role to 'user'
        const result = await User.updateMany(
            { role: { $exists: false } },
            { $set: { role: 'user' } }
        );

        console.log(`Updated ${result.modifiedCount} users to role: user`);

        // Also update any null or undefined roles
        const result2 = await User.updateMany(
            { role: null },
            { $set: { role: 'user' } }
        );

        console.log(`Updated ${result2.modifiedCount} null roles to role: user`);
        process.exit();
    } catch (error) {
        console.error('Error fixing roles:', error.message);
        process.exit(1);
    }
};

fixRoles();