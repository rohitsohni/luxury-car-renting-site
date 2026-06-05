import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from '../models/Car.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { seedDatabase } from '../configs/seed.js';

dotenv.config();

const resetCars = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.log('No MONGODB_URI found. Skipping database reset.');
            process.exit(0);
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const bookingResult = await Booking.deleteMany({});
        const carResult = await Car.deleteMany({});
        const userResult = await User.deleteMany({});

        console.log(`Deleted ${bookingResult.deletedCount} bookings from database`);
        console.log(`Deleted ${carResult.deletedCount} cars from database`);
        console.log(`Deleted ${userResult.deletedCount} users from database`);

        await seedDatabase({
            seedCars: !process.argv.includes('--empty-cars'),
            seedDemoUser: process.argv.includes('--with-demo-user'),
        });
        console.log('✓ Database reset complete!');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

resetCars();
