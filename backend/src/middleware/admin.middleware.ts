import {
    RequestHandler,
    Response,
    NextFunction,
} from "express";
import { AuthRequest } from "./auth.middleware";

export const adminOnly: RequestHandler = (
    req,
    res: Response,
    next: NextFunction
) => {
    const authReq = req as AuthRequest;

    if (authReq.user.role !== "ADMIN") {
        res.status(403).json({
            success: false,
            message: "Admin access only.",
        });
        return;
    }

    next();
};