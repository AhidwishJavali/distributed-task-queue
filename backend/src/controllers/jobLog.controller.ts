import { Request, Response, NextFunction } from "express";
import jobLogService from "../services/jobLog.service";

class JobLogController {
    async getLogs(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const rawId = (req.params as { id?: string | string[] }).id;
            const id = Array.isArray(rawId) ? rawId[0] : rawId;

            if (!id) throw new Error("Missing id parameter");

            const logs = await jobLogService.getLogs(id);

            res.status(200).json({
                success: true,
                data: logs,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new JobLogController();