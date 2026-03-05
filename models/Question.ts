import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
    text: string;
    options: string[];
    correctAnswer: number; // Index in options array
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    type: 'mcq' | 'coding';
    explanation?: string;
    codingTemplate?: string; // For coding questions
    testCases?: { input: string; output: string; isHidden: boolean }[];
}

const QuestionSchema: Schema = new Schema(
    {
        text: { type: String, required: true },
        options: [{ type: String }],
        correctAnswer: { type: Number },
        topic: { type: String, required: true },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium'
        },
        type: {
            type: String,
            enum: ['mcq', 'coding'],
            default: 'mcq'
        },
        explanation: { type: String },
        codingTemplate: { type: String },
        testCases: [
            {
                input: { type: String },
                output: { type: String },
                isHidden: { type: Boolean, default: false },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
