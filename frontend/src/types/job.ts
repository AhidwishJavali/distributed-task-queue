export interface Job {
    id: string;
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    delay: number;
    status: string;
    image: string;

processingStage: string;

progress: number;

workerName?: string;

processedImage?: string;
}

export interface JobQueryDTO {
    search?: string;

    status?: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

    priority?: "LOW" | "MEDIUM" | "HIGH";

    sort?: "newest" | "oldest";

    image: string;

processingStage: string;

progress: number;

workerName?: string;
}