import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars at the very top
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dbConnect from '../lib/dbConnect';
import User from '../models/User';
import { UserRole } from '../types/user';

async function seed() {
    try {
        await dbConnect();
        console.log('Connected to database');

        const hashedPassword = await bcrypt.hash('password123', 10);

        const demoUsers = [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashedPassword,
                role: UserRole.ADMIN,
                isVerified: true,
            },
            {
                name: 'Student User',
                email: 'student@example.com',
                password: hashedPassword,
                role: UserRole.STUDENT,
                rollNumber: 'STUD001',
                branch: 'Computer Science',
                cgpa: 8.5,
                isVerified: true,
                placementStatus: 'unplaced',
            }
        ];

        for (const userData of demoUsers) {
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                console.log(`User ${userData.email} already exists, skipping...`);
                continue;
            }
            await User.create(userData);
            console.log(`Created user: ${userData.name} (${userData.role})`);
        }

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
