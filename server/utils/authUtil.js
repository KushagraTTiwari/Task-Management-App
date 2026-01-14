import jwt from 'jsonwebtoken';
import { configVariables } from '../config/config.js';

export const generateToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        name: user.name
    };
    return jwt.sign(payload, configVariables.JWT_SECRET);
}

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        const decoded = jwt.verify(token, configVariables.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' , error: error.message});
    }
}