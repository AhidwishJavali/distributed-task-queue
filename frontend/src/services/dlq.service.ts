import api from "./api";
import type { DLQJob } from "../types/dlq";

export async function getDLQJobs() {
    const response = await api.get("/dlq");

    return response.data as {
        success: boolean;
        data: DLQJob[];
    };
}

export async function retryDLQJob(id: string) {
    const response = await api.post(
        `/dlq/${id}/retry`
    );

    return response.data;
}
export async function clearDLQ() {
    const response = await api.delete(
        "/dlq"
    );

    return response.data;
}