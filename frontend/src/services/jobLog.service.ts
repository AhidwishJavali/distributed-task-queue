import api from "./api";

export async function getJobLogs(id: string) {
    const response = await api.get(`/jobs/${id}/logs`);
    return response.data;
}