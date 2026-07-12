export interface Job {
    id: string;
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    delay: number;
    status: string;
}