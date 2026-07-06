import prisma from "../config/prisma";
import { CreateJobDTO, UpdateJobDTO } from "../types/job.types";

class JobRepository {
  async create(data: CreateJobDTO) {
    return prisma.job.create({
      data: {
        title: data.title,
        priority: data.priority,
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


}
export default new JobRepository();