import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ProjectSchema } from "../types/project";
import {
    handleCreateProject,
    handleGetAllProjects,
    handleGetProjectById,
    handleSetProjectFields,
} from "../controllers/projects";

export default async function Projects(
    app: FastifyInstance,
) {
    app.get(
        "/projects",
        {
            schema: {
                response: {
                    400: z.object({
                        message: z.string(),
                    }),
                    500: z.object({
                        message: z.string(),
                    }),
                },
            },
        },
        handleGetAllProjects,
    );

    app.get(
        "/projects/:id",
        {
            schema: {
                params: z.object({
                    id: z.uuid(),
                }),
                response: {
                    400: z.object({
                        message: z.string(),
                    }),
                    500: z.object({
                        message: z.string(),
                    }),
                },
            },
        },
        handleGetProjectById,
    );

    app.post(
        "/projects",
        {
            schema: {
                body: ProjectSchema,
                response: {
                    400: z.object({
                        message: z.string(),
                    }),
                    500: z.object({
                        message: z.string(),
                    }),
                },
            },
        },
        handleCreateProject,
    );

    app.post(
        "/projects/:id",
        {
            schema: {
                params: z.object({
                    id: z.uuid(),
                }),
                body: z.object({
                    fields: z.json(),
                }),
                response: {
                    400: z.object({
                        message: z.string(),
                    }),
                    500: z.object({
                        message: z.string(),
                    }),
                },
            },
        },
        handleSetProjectFields,
    );
}
