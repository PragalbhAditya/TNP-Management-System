import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    role: String,
});

const User = mongoose.model('User', UserSchema);

async function listAdmins() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const admins = await User.find({ role: { $in: ['admin', 'super-admin'] } });
        console.log('Admins found:');
        admins.forEach(admin => {
            console.log(`- ${admin.name} (${admin.email}) [Role: ${admin.role}]`);
        });

    } catch (error) {
        console.error('Error listing admins:', error);
    } finally {
        await mongoose.disconnect();
    }
}

listAdmins();
