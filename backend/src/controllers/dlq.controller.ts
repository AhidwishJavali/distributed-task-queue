import { RequestHandler } from "express";
import dlqService from "../services/dlq.service";
import { AuthRequest } from "../middleware/auth.middleware";

class DLQController {
    getFailedJobs: RequestHandler = async (
        req,
        res,
        next
    ) => {
        try {
            const authReq = req as AuthRequest;

const jobs =
    await dlqService.getFailedJobs(
        authReq.user.id,
        authReq.user.role
    );

            res.json({
                success: true,
                data: jobs,
            });
        } catch (err) {
            next(err);
        }
    };

    retryJob: RequestHandler = async (
        req,
        res,
        next
    ) => {
        try {
            const id = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

const authReq = req as AuthRequest;

await dlqService.retry(
    id,
    authReq.user.id,
    authReq.user.role
);

            res.json({
                success: true,
                message:
                    "Job retried successfully",
            });
        } catch (err) {
            next(err);
        }
    };
    deleteJob: RequestHandler = async (
    req,
    res,
    next
) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;

        const authReq = req as AuthRequest;

        await dlqService.delete(
            id,
            authReq.user.id,
            authReq.user.role
        );

        res.json({
            success: true,
            message: "DLQ job deleted successfully.",
        });
    } catch (err) {
        next(err);
    }
};
    clearDLQ: RequestHandler = async (
    req,
    res,
    next
) => {
    try {

        const authReq = req as AuthRequest;

await dlqService.clear(
    authReq.user.id,
    authReq.user.role
);

        res.json({
            success: true,
            message: "DLQ cleared successfully.",
        });

    } catch (err) {

        next(err);

    }
};
}

export default new DLQController();