import mongoose from "mongoose";
import { DESCRIPTION, DUE_DATE, STATUS, TITLE } from "../constant/enum.js";
import Task from "../models/task.model.js";

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    const taskExists = await Task.findOne({ title, createdBy: userId });
    if (taskExists) {
      return res.status(409).json({ message: "Task with this title already exists." });
    }

    const allowedFields = [TITLE, DESCRIPTION, STATUS, DUE_DATE];
    const data = {};

    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        data[key] = req.body[key];
      }
    }

    data.createdBy = userId;

    const newTask = await Task.create(data);
    return res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tasks = await Task.find({ createdBy: userId }).skip(skip).limit(limit);
    const totalTasks = await Task.countDocuments({ createdBy: userId });

    return res.status(200).json({ tasks, totalTasks });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const {title} = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    if (title) {
        const taskExists = await Task.findOne({ title, createdBy: userId, _id:{ $ne: id}});
        if (taskExists) {
          return res.status(409).json({ message: "Task with this title already exists." });
        }
    }

    const allowedFields = [TITLE, DESCRIPTION, STATUS, DUE_DATE];
    const updateData = {};

    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, createdBy: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
