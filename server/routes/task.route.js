import express from "express";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/task.controller.js";
import { verifyToken } from "../utils/authUtil.js";
import { createTaskValidateBody, updateTaskValidateBody, validateBody } from "../middleware/validate.js";
const router = express.Router();

router.post("/", verifyToken, validateBody(createTaskValidateBody), createTask);
router.get("/", verifyToken, getTasks);
router.put("/:id", verifyToken, validateBody(updateTaskValidateBody), updateTask);
router.delete("/:id", verifyToken, deleteTask);

export default router;