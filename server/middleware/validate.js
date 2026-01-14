import joi from 'joi';
import { DONE, IN_PROGRESS, TODO } from '../constant/enum.js';

export const userValidateBody = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
})


export const createTaskValidateBody = joi.object({
    title: joi.string().min(3).max(100).required(),
    description: joi.string().max(500).optional(),
    status: joi.string().valid(TODO, IN_PROGRESS, DONE).optional(),
    dueDate: joi.date().optional()
})

export const updateTaskValidateBody = joi.object({
  title: joi.string().min(3).max(100).optional(),
  description: joi.string().max(500).optional(),
  status: joi.string().valid(TODO, IN_PROGRESS, DONE).optional(),
  dueDate: joi.date().optional()
}).min(1);


export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const message = error.details.map((d) => d.message).join(", ");
      return res.status(400).json({ message });
    }
    next();
  };
};