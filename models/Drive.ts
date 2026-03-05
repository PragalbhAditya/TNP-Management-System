import mongoose, { Schema, Document } from 'mongoose';

export interface IDrive extends Document {
    companyName: string;
    logo?: string;
    role: string;
    description: string;
    package: string; // e.g. "12 LPA"
    location: string;
    driveDate: Date;
    applicationDeadline: Date;
    eligibility: {
        minCgpa: number;
        maxBacklogs: number;
        allowedBranches: string[];
    };
    rounds: {
        name: string;
        description?: string;
        type: 'aptitude' | 'coding' | 'technical' | 'hr' | 'other';
    }[];
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'expired';
    createdBy: mongoose.Types.ObjectId; // Admin who created it
    createdAt: Date;
    updatedAt: Date;
}

const DriveSchema: Schema = new Schema(
    {
        companyName: { type: String, required: true },
        logo: { type: String },
        role: { type: String, required: true },
        description: { type: String, required: true },
        package: { type: String, required: true },
        location: { type: String, required: true },
        driveDate: { type: Date, required: true },
        applicationDeadline: { type: Date, required: true },
        eligibility: {
            minCgpa: { type: Number, default: 0 },
            maxBacklogs: { type: Number, default: 0 },
            allowedBranches: [{ type: String }],
        },
        rounds: [
            {
                name: { type: String, required: true },
                description: { type: String },
                type: {
                    type: String,
                    enum: ['aptitude', 'coding', 'technical', 'hr', 'other'],
                    default: 'technical'
                },
            },
        ],
        status: {
            type: String,
            enum: ['upcoming', 'ongoing', 'completed', 'cancelled', 'expired'],
            default: 'upcoming'
        },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Drive || mongoose.model<IDrive>('Drive', DriveSchema);
