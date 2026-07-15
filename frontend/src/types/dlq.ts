export interface DLQJob {
    id: string;
    jobId: string;
    bullJobId: string;
    title: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    error: string;
    failedAt: string;
}