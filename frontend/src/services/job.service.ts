import api from "./api";

export interface CreateJobData {
    title: string;
    description: string;
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