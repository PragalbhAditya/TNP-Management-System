import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Manually define User schema in script for simplicity to avoid import complexities
// but use the URI from .env.local
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String },
    role: String,
    isVerified: { type: Boolean, default: true }
});

const User = mongoose.model('User', UserSchema);

async function createSuperAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const name = 'Super Admin';
        const email = 'superadmin@nce.com';
        const password = 'superadminpassword'; // User should change this
        const role = 'super-admin';

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Super Admin already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            isVerified: true
        });

        console.log('Super Admin successfully created');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

    } catch (error) {
        console.error('Error creating Super Admin:', error);
    } finally {
        await mongoose.disconnect();
    }
}

createSuperAdmin();
