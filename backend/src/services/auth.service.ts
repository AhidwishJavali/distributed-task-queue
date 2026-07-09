import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository";
import {
    LoginUserDTO,
    RegisterUserDTO,
} from "../types/user.types";

class AuthService {
    async register(data: RegisterUserDTO) {
        const existingUser = await userRepository.findByEmail(
            data.email
        );

        if (existingUser) {
            throw new Error("Email already registered");
        }

        const hashedPassword = await bcrypt.hash(
            data.password,
            10
        );

        const user = await userRepository.create({
            ...data,
            password: hashedPassword,
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email,
             role: user.role,
        };
    }

    async login(data: LoginUserDTO) {
        const user = await userRepository.findByEmail(
            data.email
        );

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const validPassword = await bcrypt.compare(
            data.password,
            user.password
        );

        if (!validPassword) {
            throw new Error("Invalid credentials");
        }
        const secret = process.env.JWT_SECRET;

    if (!secret) {
    throw new Error("JWT_SECRET is not configured");
}
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            secret,
            {
                expiresIn: "1d",
            }
        );
        
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                 role: user.role,
            },
        };
    }
}

export default new AuthService();