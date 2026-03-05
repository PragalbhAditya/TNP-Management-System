import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
    title: string;
    description: string;
    topic: string; // e.g. "Data Structures", "Aptitude"
    type: 'pdf' | 'video' | 'link' | 'text';
    contentUrl?: string;
    textContent?: string;
    tags: string[];
    createdBy: mongoose.Types.ObjectId;
}

const MaterialSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        topic: { type: String, required: true },
        type: {
            type: String,
            enum: ['pdf', 'video', 'link', 'text'],
            required: true
        },
        contentUrl: { type: String },
        textContent: { type: String },
        tags: [{ type: String }],
        createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

export default mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialSchema);
