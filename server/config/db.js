import mongoose from "mongoose";
import { configVariables } from "./config.js";


export const connectDB = async () => {
    try {
        await mongoose.connect(configVariables.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error while connecting to MongoDB:", error);
        process.exit(1);
    }
};