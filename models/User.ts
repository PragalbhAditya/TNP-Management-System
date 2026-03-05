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
    registrationNumber?: string;
    branch?: string;
    branchCode?: string;
    course?: 'B.Tech' | 'M.Tech';
    currentYear?: number;
    currentSemester?: number;
    batchYear?: number;
    admissionYear?: number;
    passingYear?: number;
    entryType?: 'Regular' | 'Lateral';
    gender?: 'Male' | 'Female' | 'Other';
    dateOfBirth?: Date;
    religion?: string;
    category?: 'GEN' | 'OBC' | 'SC' | 'ST' | 'EWS';
    aadhaar?: string;

    // Student Specific - College/Location
    collegeName?: string;
    collegeCode?: string;
    willingToRelocate?: boolean;

    // Student Specific - Contact Information
    whatsappNumber?: string;
    alternatePhone?: string;
    permanentAddress?: string;

    // Student Specific - Academic Information
    school10th?: string;
    board10th?: string;
    percentage10th?: number;
    year10th?: number;
    school12th?: string;
    board12th?: string;
    percentage12th?: number;
    year12th?: number;
    diplomaCollege?: string;
    diplomaBoard?: string;
    diplomaPercentage?: number;
    diplomaYear?: number;
    cgpa?: number;
    cgpaUpToSemester?: number;
    semesterWiseSGPA?: { semester: number; sgpa: number }[];
    activeBacks?: number;
    totalBacklogs?: number;

    // Other Student Info
    resumeUrl?: string;
    marksheetUrl?: string;
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
        registrationNumber: { type: String },
        branch: { type: String },
        branchCode: { type: String },
        course: { type: String, enum: ['B.Tech', 'M.Tech'] },
        currentYear: { type: Number },
        currentSemester: { type: Number },
        batchYear: { type: Number },
        admissionYear: { type: Number },
        passingYear: { type: Number },
        entryType: { type: String, enum: ['Regular', 'Lateral'] },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        dateOfBirth: { type: Date },
        religion: { type: String },
        category: { type: String, enum: ['GEN', 'OBC', 'SC', 'ST', 'EWS'] },
        aadhaar: { type: String },

        // Student Specific - College/Location
        collegeName: { type: String },
        collegeCode: { type: String },
        willingToRelocate: { type: Boolean, default: false },

        // Student Specific - Contact Information
        whatsappNumber: { type: String },
        alternatePhone: { type: String },
        permanentAddress: { type: String },

        // Student Specific - Academic Information
        school10th: { type: String },
        board10th: { type: String },
        percentage10th: { type: Number },
        year10th: { type: Number },
        school12th: { type: String },
        board12th: { type: String },
        percentage12th: { type: Number },
        year12th: { type: Number },
        diplomaCollege: { type: String },
        diplomaBoard: { type: String },
        diplomaPercentage: { type: Number },
        diplomaYear: { type: Number },
        cgpa: { type: Number },
        cgpaUpToSemester: { type: Number },
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
        marksheetUrl: { type: String },
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
