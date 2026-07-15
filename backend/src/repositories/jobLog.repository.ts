import prisma from "../config/prisma";

class JobLogRepository {
    async create(jobId: string, message: string) {
        return prisma.jobLog.create({
            data: {
                jobId,
                message,
            },
        });
    }

    async findByJob(jobId: string) {
        return prisma.jobLog.findMany({
            where: {
                jobId,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
    }
    async findByJobId(jobId: string) {
    return prisma.jobLog.findMany({
        where: {
            jobId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}
}

export default new JobLogRepository();