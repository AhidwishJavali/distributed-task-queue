import {
    Response,
    NextFunction,
    RequestHandler,
} from "express";

import { AuthRequest } from "../middleware/auth.middleware";
import userService from "../services/user.service";

class UserController {
    getUsers: RequestHandler = async (
        req,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const users = await userService.getUsers();

            res.status(200).json({
                success: true,
                count: users.length,
                data: users,
            });

            return;
        } catch (error) {
            next(error);
            return;
        }
    };

    getUserJobs: RequestHandler = async (
        req,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const authReq = req as AuthRequest;

            const id = Array.isArray(authReq.params.id)
                ? authReq.params.id[0]
                : authReq.params.id;

            const jobs =
                await userService.getUserJobs(id);

            res.status(200).json({
                success: true,
                count: jobs.length,
                data: jobs,
            });

            return;
        } catch (error) {
            next(error);
            return;
        }
    };

    deleteUser: RequestHandler = async (
        req,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const authReq = req as AuthRequest;

            const id = Array.isArray(authReq.params.id)
                ? authReq.params.id[0]
                : authReq.params.id;

            await userService.deleteUser(id);

            res.status(200).json({
                success: true,
                message: "User deleted successfully",
            });

            return;
        } catch (error: any) {
    if (
        error.message ===
        "Admin account cannot be deleted."
    ) {
        res.status(403).json({
            success: false,
            message:
                "Admin account cannot be deleted.",
        });
        return;
    }

    next(error);
    return;
}
    };
}

export default new UserController();