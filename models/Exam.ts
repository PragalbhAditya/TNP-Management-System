import mongoose, { Schema, Document } from 'mongoose';

export interface IExam extends Document {
    title: string;
    description: string;
    drive?: mongoose.Types.ObjectId;
    startTime: Date;
    duration: number; // in minutes
    questions: mongoose.Types.ObjectId[]; // References to Question model
    sections: {
        name: string;
        description?: string;
        questions: mongoose.Types.ObjectId[];
    }[];
    isLive: boolean;
    settings: {
        fullscreenRequired: boolean;
        tabSwitchLimit: number;
        proctoringEnabled: boolean;
    };
    createdBy: mongoose.Types.ObjectId;
}

const ExamSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        drive: { type: Schema.Types.ObjectId, ref: 'Drive' },
        startTime: { type: Date, required: true },
        duration: { type: Number, required: true },
        questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
        sections: [
            {
                name: { type: String, required: true },
                description: { type: String },
                questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
            },
        ],
        isLive: { type: Boolean, default: false },
        settings: {
            fullscreenRequired: { type: Boolean, default: true },
            tabSwitchLimit: { type: Number, default: 3 },
            proctoringEnabled: { type: Boolean, default: true },
        },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

export default mongoose.models.Exam || mongoose.model<IExam>('Exam', ExamSchema);
