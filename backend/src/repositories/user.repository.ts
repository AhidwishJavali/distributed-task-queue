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
}

export default new UserRepository();