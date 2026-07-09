import {
    NextFunction,
    Request,
    Response,
    RequestHandler,
} from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user: {
        id: string;
        email: string;
        role: "USER" | "ADMIN";
    };
}

export const authenticate: RequestHandler = (
    req,
    res,
    next
): void => {
    const authReq = req as AuthRequest;

    const header = authReq.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
        return;
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(
             token,
    process.env.JWT_SECRET!
        ) as {
    id: string;
    email: string;
    role: "USER" | "ADMIN";
};

        authReq.user = decoded;

        next();
    } catch {
        res.status(401).json({
            success: false,
            message: "Invalid token",
        });
        return;
    }
};