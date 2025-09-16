import { NextFunction, Response, Request } from "express"
import jwt from "jsonwebtoken";
import { config } from "./config/config";
import { AuthRequest } from "./types";

export const userMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'Unauthorized'
        });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as { id: string; username: string };
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Invalid token'
        })
    }
}