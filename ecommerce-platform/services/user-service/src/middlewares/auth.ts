import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


// Extend Express Request to include 'user'
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            };
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET || '';

    try {
        const decoded = jwt.verify(token, secretKey) as { id: string, role: string };
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};

export const requireRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ message: `Forbidden: Requires ${role} role` });
        }
        next();
    };
};