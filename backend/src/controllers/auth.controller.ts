import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";

class AuthController {
    async register(req: Request, res: Response,
    next: NextFunction) {
        try {
            const user = await authService.register(req.body);

            res.status(201).json({
                success: true,
                data: user,
            });
            return;
        } catch (error: any) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.login(req.body);

            res.json({
                success: true,
                data: result,
            });
            return;
        } catch (error: any) {
            next(error);
        }
    }
}

export default new AuthController();