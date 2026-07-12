import prisma from "../config/prisma";
import { RegisterUserDTO } from "../types/user.types";

class UserRepository {
    async create(data: RegisterUserDTO) {
        return prisma.user.create({
            data,
        });
    }

    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async findById(id: string) {
        return prisma.user.findUnique({
            where: {
                id,
            },
        });
    }
    async findAll() {
    return prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            _count: {
                select: {
                    jobs: true,
                },
            },
        },
    });
}

async findJobs(userId: string) {
    return prisma.job.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

async deleteUser(userId: string) {
    await prisma.job.deleteMany({
        where: {
            userId,
        },
    });

    return prisma.user.delete({
        where: {
            id: userId,
        },
    });
}
}



export default new UserRepository();