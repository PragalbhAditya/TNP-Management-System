import mongoose, { Schema, models } from "mongoose";

const NoticeSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Notice = models.Notice || mongoose.model("Notice", NoticeSchema);

export default Notice;
