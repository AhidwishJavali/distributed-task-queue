import prisma from "../config/prisma";
import { CreateJobDTO, UpdateJobDTO,JobQueryDTO} from "../types/job.types";

class JobRepository {
  async create(data: CreateJobDTO) {
    return prisma.job.create({
       data: {
    title: data.title,
    description: data.description,
    priority: data.priority,
    delay: data.delay ?? 0,
    userId: data.userId,
    image: data.image,
},
    });
}
  async findAll() {
    return prisma.job.findMany({
        orderBy: {
            createdAt: "desc"
        }
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
/*async findAllByUser(userId: string) {
    return prisma.job.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}*/
async findAllByUser(
    userId: string,
    role: "USER" | "ADMIN",
    query: JobQueryDTO
) {
    return prisma.job.findMany({
        where: {
            ...(role === "ADMIN" ? {} : { userId }),

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
async findByIdForUser(
    id: string,
    userId: string,
    role: "USER" | "ADMIN"
) {
    return prisma.job.findFirst({
        where: {
            id,
            ...(role === "ADMIN" ? {} : { userId }),
        },
    });
}

async updateForUser(
    id: string,
    userId: string,
    role: "USER" | "ADMIN",
    data: UpdateJobDTO
) {
    const job = await this.findByIdForUser(
        id,
        userId,
        role
    );

    if (!job) {
        throw new Error("Job not found");
    }

    return prisma.job.update({
        where: {
            id,
        },
        data,
    });
}
async deleteForUser(
    id: string,
    userId: string,
    role: "USER" | "ADMIN"
) {
    const job = await this.findByIdForUser(
        id,
        userId,
        role
    );

    if (!job) {
        throw new Error("Job not found");
    }

    return prisma.job.delete({
        where: {
            id,
        },
    });
}
async deleteAllForUser(
    userId: string,
    role: "USER" | "ADMIN"
) {
    return prisma.job.deleteMany({
        where:
            role === "ADMIN"
                ? {}
                : {
                      userId,
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

}
export default new JobRepository();