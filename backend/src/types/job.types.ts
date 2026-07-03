export interface CreateJobDTO {
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
}
export interface JobParams {
    id: string;
}
export interface UpdateJobDTO {
  status?: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  startedAt?: Date;
  completedAt?: Date;
}