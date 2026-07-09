export interface RegisterUserDTO {
    name: string;
    email: string;
    password: string;
    role?: "USER" | "ADMIN";
}

export interface LoginUserDTO {
    email: string;
    password: string;
}