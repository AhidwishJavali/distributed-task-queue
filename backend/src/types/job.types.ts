export interface CreateJobDTO {
    title: string;
    description?: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    delay?: number;
    userId: string;
    image: string;
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

    image?: string;
}

export interface JobQueryDTO {
    search?: string;

    status?: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

    priority?: "LOW" | "MEDIUM" | "HIGH";

    sort?: "newest" | "oldest";
}