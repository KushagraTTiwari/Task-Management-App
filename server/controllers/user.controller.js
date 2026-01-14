import User from '../models/user.model.js';
import { generateToken } from '../utils/authUtil.js';
import { comparePassword, generateHashPassword } from '../utils/utilHelper.js';

export const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({message: 'name, email and password are required fields.'});
        }

        const user  = await User.findOne({email});
        if (user) {
            return res.status(409).json({message: 'User with this email or name already exists.'});
        }

        const newUser = new User({
            name,
            email,
            password: generateHashPassword(password)
        })
        await newUser.save();

        const token = generateToken(newUser);
        return res.status(201).json({message:"User registered successfully", token});
    } catch (error) {
        return res.status(500).json({message: 'Internal server error', error: error.message});
    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({message: 'email and password are required fields.'});
        }

        const user  = await User.findOne({email});
        if (!user) {
            return res.status(404).json({message: 'User not found.'});
        }

        if(!comparePassword(password, user.password)) {
            return res.status(401).json({message: 'Invalid password.'});
        }

        const token = generateToken(user);
        return res.status(200).json({message:"User logged in successfully", token});
    } catch (error) {
        return res.status(500).json({message: 'Internal server error', error: error.message});
    }
}