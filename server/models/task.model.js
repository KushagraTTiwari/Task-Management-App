import mongoose from "mongoose";
import { DONE, IN_PROGRESS, TODO } from "../constant/enum.js";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: [TODO, IN_PROGRESS, DONE],
        default: TODO
    },
    dueDate: {
        type: Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, {
    timestamps: true
})

export default mongoose.model("task", taskSchema);