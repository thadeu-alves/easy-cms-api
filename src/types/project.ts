import { JsonObject } from "@prisma/client/runtime/library";
import z from "zod";

export interface ProjectProps {
    id: string;
    name: string;
    slug: string;
    title?: string;
    description?: string;
    featuredImage?: string;
    fields?: JsonObject;
    createdAt: string;
    updatedAt: string;
}

export const ProjectSchema = z.object({
    name: z.string(),
    slug: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    featuredImage: z.string().optional(),
    fields: z.any().optional(),
});
