import { Request, Response } from "express";
import authService from "../services/auth.service";

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const user = await authService.register(req.body);

            res.status(201).json({
                success: true,
                data: user,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const result = await authService.login(req.body);

            res.json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            res.status(401).json({
                success: false,
                message: error.message,
            });
        }
    }
}

export default new AuthController();