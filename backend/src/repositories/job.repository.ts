import prisma from "../config/prisma";
import { CreateJobDTO, UpdateJobDTO,JobQueryDTO} from "../types/job.types";

class JobRepository {
  async create(data: CreateJobDTO) {
    return prisma.job.create({
       data: {
    title: data.title,
    priority: data.priority,
    delay: data.delay ?? 0,
    image: data.image,
},
    });
}
async findById(id: string) {
    return prisma.job.findUnique({
        where: {
            id,
        },
    });
}
async update(id: string, data: UpdateJobDTO) {
  return prisma.job.update({
    where: {
      id,
    },
    data,
  });
}
async delete(id: string) {
    return prisma.job.delete({
        where: {
            id,
        },
    });
}
async deleteAll(){
    return prisma.job.deleteMany();
}
async updateStatus(
  id: string,
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED"
) {
  return prisma.job.update({
    where: { id },
    data: {
      status,
      startedAt: status === "RUNNING" ? new Date() : undefined,
      completedAt:
        status === "COMPLETED" || status === "FAILED"
          ? new Date()
          : undefined,
    },
  });
}
async updateProcessing(
    id: string,
    data: {
        processingStage?: string;
        progress?: number;
        workerName?: string | null;
    }
) {
    return prisma.job.update({
        where: {
            id,
        },
        data,
    });
}

async findAll(query: JobQueryDTO) {
    return prisma.job.findMany({
        where: {
            ...(query.search
                ? {
                      title: {
                          contains: query.search,
                          mode: "insensitive",
                      },
                  }
                : {}),

            ...(query.status
                ? {
                      status: query.status,
                  }
                : {}),

            ...(query.priority
                ? {
                      priority: query.priority,
                  }
                : {}),
        },

        orderBy: {
            createdAt:
                query.sort === "oldest"
                    ? "asc"
                    : "desc",
        },
    });
}
async updateProgress(
    id: string,
    progress: number,
    processingStage: string,
    workerName: string
) {
    return prisma.job.update({
        where: {
            id,
        },
        data: {
            progress,
            processingStage,
            workerName,
        },
    });
}

async updateProcessedImage(
    id: string,
    processedImage: string
) {
    return prisma.job.update({
        where: {
            id,
        },
        data: {
            processedImage,
        },
    });
}
async getStatistics(
) {
    

    const [
        total,
        pending,
        running,
        completed,
        failed,
    ] = await Promise.all([
        prisma.job.count({
            where: {},
        }),

        prisma.job.count({
            where: {
                
                status: "PENDING",
            },
        }),

        prisma.job.count({
            where: {
                
                status: "RUNNING",
            },
        }),

        prisma.job.count({
            where: {
                
                status: "COMPLETED",
            },
        }),

        prisma.job.count({
            where: {
            
                status: "FAILED",
            },
        }),
    ]);

    return {
        total,
        pending,
        running,
        completed,
        failed,
    };
}

}
export default new JobRepository();