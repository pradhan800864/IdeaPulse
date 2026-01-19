import { z } from "zod";
import { SourceType, IdeaStatus } from "@prisma/client";

export const ideaSchema = z.object({
    title: z.string().min(1, "Title is required"),
    summary: z.string().optional(),
    sourceUrl: z.string().url("Invalid URL"),
    source: z.nativeEnum(SourceType),
    sourceId: z.string().optional(),
    author: z.string().optional(),
    publishedAt: z.string().or(z.date()).optional(),
    metrics: z.record(z.string(), z.any()).optional(),
});

export const updateIdeaStatusSchema = z.object({
    status: z.nativeEnum(IdeaStatus),
});

export const sourceConfigSchema = z.object({
    enabled: z.boolean(),
    apiKey: z.string().optional(),
    apiSecret: z.string().optional(),
});
