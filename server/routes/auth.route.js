import express from "express";
import { userValidateBody, validateBody } from "../middleware/validate.js";
import { userLogin, userRegister } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/register", validateBody(userValidateBody), userRegister);
router.post("/login", userLogin);

export default router;