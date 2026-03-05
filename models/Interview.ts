import mongoose, { Schema, Document } from 'mongoose';

export interface IInterview extends Document {
    application: mongoose.Types.ObjectId;
    drive: mongoose.Types.ObjectId;
    student: mongoose.Types.ObjectId;
    interviewer: string;
    startTime: Date;
    endTime: Date;
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    feedback?: string;
    score?: number;
    meetingLink?: string;
}

const InterviewSchema: Schema = new Schema(
    {
        application: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
        drive: { type: Schema.Types.ObjectId, ref: 'Drive', required: true },
        student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        interviewer: { type: String, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        status: {
            type: String,
            enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
            default: 'scheduled'
        },
        feedback: { type: String },
        score: { type: Number },
        meetingLink: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema);
