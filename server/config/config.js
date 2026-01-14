import dotenv from "dotenv";
dotenv.config({quiet: true});

export const configVariables = {
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/task_management",
    PORT: process.env.PORT || 8000,
    JWT_SECRET: process.env.JWT_SECRET || "t@a#s$k%-@",
}