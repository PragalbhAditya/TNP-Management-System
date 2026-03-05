import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '@/types/user';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    image?: string;
    contact?: string;
    isVerified: boolean;
    isBlocked: boolean;

    // Student Specific - Basic Information
    rollNumber?: string;
    branch?: string;
    course?: 'B.Tech' | 'M.Tech';
    batchYear?: number;
    gender?: 'Male' | 'Female' | 'Other';
    dateOfBirth?: Date;
    category?: 'GEN' | 'OBC' | 'SC' | 'ST' | 'EWS';
    aadhaar?: string;

    // Student Specific - Contact Information
    alternatePhone?: string;
    permanentAddress?: string;

    // Student Specific - Academic Information
    board10th?: string;
    percentage10th?: number;
    year10th?: number;
    board12th?: string;
    percentage12th?: number;
    year12th?: number;
    diplomaBoard?: string;
    diplomaPercentage?: number;
    diplomaYear?: number;
    cgpa?: number;
    semesterWiseSGPA?: { semester: number; sgpa: number }[];
    activeBacks?: number;
    totalBacklogs?: number;

    // Other Student Info
    resumeUrl?: string;
    skills?: string[];
    placementStatus?: 'unplaced' | 'placed' | 'offered';
    backlogs?: number;

    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.STUDENT
        },
        image: { type: String },
        contact: { type: String },
        isVerified: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },

        // Student Specific - Basic Information
        rollNumber: { type: String },
        branch: { type: String },
        course: { type: String, enum: ['B.Tech', 'M.Tech'] },
        batchYear: { type: Number },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        dateOfBirth: { type: Date },
        category: { type: String, enum: ['GEN', 'OBC', 'SC', 'ST', 'EWS'] },
        aadhaar: { type: String },

        // Student Specific - Contact Information
        alternatePhone: { type: String },
        permanentAddress: { type: String },

        // Student Specific - Academic Information
        board10th: { type: String },
        percentage10th: { type: Number },
        year10th: { type: Number },
        board12th: { type: String },
        percentage12th: { type: Number },
        year12th: { type: Number },
        diplomaBoard: { type: String },
        diplomaPercentage: { type: Number },
        diplomaYear: { type: Number },
        cgpa: { type: Number },
        semesterWiseSGPA: [
            {
                semester: { type: Number },
                sgpa: { type: Number }
            }
        ],
        activeBacks: { type: Number, default: 0 },
        totalBacklogs: { type: Number, default: 0 },

        // Other Student Info
        resumeUrl: { type: String },
        skills: [{ type: String }],
        placementStatus: {
            type: String,
            enum: ['unplaced', 'placed', 'offered'],
            default: 'unplaced'
        },
        backlogs: { type: Number, default: 0 }
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
