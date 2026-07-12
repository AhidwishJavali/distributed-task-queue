export interface CreateJobDTO {
    title: string;
    description?: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    delay?: number;
    userId: string;
}

export interface JobParams {
    id: string;
}
export interface UpdateJobDTO {
    title?: string;
    description?: string;

    priority?: "LOW" | "MEDIUM" | "HIGH";

    status?: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

    startedAt?: Date;

    completedAt?: Date;

    delay?: number;
}