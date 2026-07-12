import api from "./api";

export interface CreateJobData {
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
     delay: number;
}

export const getJobs = async () => {
    const response = await api.get("/jobs");
    return response.data;
};

export const createJob = async (
    data: CreateJobData
) => {
    const response = await api.post("/jobs", data);
    return response.data;
};

export const deleteJob = async (
    id: string
) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
};

export interface UpdateJobData {
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
     delay: number;
}

export const updateJob = async (
    id: string,
    data: UpdateJobData
) => {
    const response = await api.patch(
        `/jobs/${id}`,
        data
    );

    return response.data;
};

export const deleteAllJobs = async () => {
    const response = await api.delete("/jobs");
    return response.data;
};