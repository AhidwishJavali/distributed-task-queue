import { NextFunction, Request, Response } from "express";

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(err);

    if (err.name === "ZodError") {
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: err.issues,
        });
    }

    if (err.code === "P2025") {
        return res.status(404).json({
            success: false,
            message: "Resource not found",
        });
    }


    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }


    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}