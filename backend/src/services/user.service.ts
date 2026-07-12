import userRepository from "../repositories/user.repository";

class UserService {
    async getUsers() {
        return userRepository.findAll();
    }

    async getUserJobs(userId: string) {
        return userRepository.findJobs(userId);
    }

    async deleteUser(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.role === "ADMIN") {
        throw new Error(
            "Admin account cannot be deleted."
        );
    }

    return userRepository.deleteUser(userId);
}
}

export default new UserService();