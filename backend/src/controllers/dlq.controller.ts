import { RequestHandler } from "express";
import dlqService from "../services/dlq.service";

class DLQController {
    getFailedJobs: RequestHandler = async (
        req,
        res,
        next
    ) => {
        try {

const jobs =
    await dlqService.getFailedJobs();

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


await dlqService.retry(id);

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


        await dlqService.delete(
            id,
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

        

        await dlqService.clear();

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