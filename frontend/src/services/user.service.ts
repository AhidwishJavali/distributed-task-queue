import api from "./api";

export const getUsers = async () => {
    const response = await api.get("/users");
    return response.data;
};

export const getUserJobs = async (
    userId: string
) => {
    const response = await api.get(
        `/users/${userId}/jobs`
    );
    return response.data;
};

export const deleteUser = async (
    userId: string
) => {
    const response = await api.delete(
        `/users/${userId}`
    );
    return response.data;
};