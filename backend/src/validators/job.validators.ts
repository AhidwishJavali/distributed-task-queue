import { z } from "zod";

export const createJobSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(100, "Title cannot exceed 100 characters"),

    description: z
        .string()
        .trim()
        .optional(),

    priority: z
        .enum(["LOW", "MEDIUM", "HIGH"])
        .default("MEDIUM"),

    delay: z
        .number()
        .int()
        .min(0)
        .optional(),

    image: z
        .string()
        .trim()
        .min(1, "Image is required"),
});
export const updateJobSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(
            100,
            "Title cannot exceed 100 characters"
        )
        .optional(),

    description: z
        .string()
        .trim()
        .optional(),

    priority: z
        .enum([
            "LOW",
            "MEDIUM",
            "HIGH",
        ])
        .optional(),

    status: z
        .enum([
            "PENDING",
            "RUNNING",
            "COMPLETED",
            "FAILED",
        ])
        .optional(),

    startedAt: z
        .string()
        .datetime()
        .optional(),

    completedAt: z
        .string()
        .datetime()
        .optional(),

    delay: z
        .number()
        .int()
        .min(0)
        .optional(),
    image: z
    .string()
    .trim()
    .optional(),
});