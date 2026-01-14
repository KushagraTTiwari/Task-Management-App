import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import taskRoutes from "./routes/task.route.js";
import authRoutes from "./routes/auth.route.js";
import { configVariables } from "./config/config.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));


app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


const PORT = configVariables.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});