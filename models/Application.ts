import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
    student: mongoose.Types.ObjectId;
    drive: mongoose.Types.ObjectId;
    status: 'applied' | 'shortlisted' | 'rejected' | 'placed';
    currentRound: number; // Index of the round in Drive model
    scores: {
        roundIndex: number;
        score: number;
        feedback?: string;
    }[];
    appliedAt: Date;
}

const ApplicationSchema: Schema = new Schema(
    {
        student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        drive: { type: Schema.Types.ObjectId, ref: 'Drive', required: true },
        status: {
            type: String,
            enum: ['applied', 'shortlisted', 'rejected', 'placed'],
            default: 'applied'
        },
        currentRound: { type: Number, default: 0 },
        scores: [
            {
                roundIndex: { type: Number },
                score: { type: Number },
                feedback: { type: String },
            },
        ],
    },
    { timestamps: { createdAt: 'appliedAt', updatedAt: true } }
);

// Ensure a student can only apply once to a drive
ApplicationSchema.index({ student: 1, drive: 1 }, { unique: true });

export default mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
