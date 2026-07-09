export interface CreateJobDTO {
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  delay?: number;
  userId: string;
}
export interface JobParams {
    id: string;
}
export interface UpdateJobDTO {
  status?: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  startedAt?: Date;
  completedAt?: Date;
}