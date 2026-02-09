import { FastifyReply, FastifyRequest } from "fastify";
import {
    createProject,
    getAllProjects,
    getProjectById,
    setProjectFields,
} from "../models/projects";
import { ProjectProps } from "../types/project";
import { InputJsonObject } from "@prisma/client/runtime/library";
import z, { ZodError } from "zod";

export async function handleGetAllProjects(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    try {
        const data = await getAllProjects();

        return reply.send({ data });
    } catch (err) {
        console.log(err);
        if (err instanceof Error) {
            return reply.status(400).send({
                message: err.message,
            });
        }

        return reply.status(500).send({
            message: "Internal Server Error",
        });
    }
}

export async function handleGetProjectById(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    try {
        const { id } = request.params as {
            id: string;
        };

        const data = await getProjectById(id);

        return reply.send({ data });
    } catch (err) {
        console.log(err);
        if (err instanceof Error) {
            return reply.status(400).send({
                message: err.message,
            });
        }

        return reply.status(500).send({
            message: "Internal Server Error",
        });
    }
}

export async function handleCreateProject(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    try {
        const data = request.body as ProjectProps;

        await createProject(data);

        return reply.send({ data }).status(201);
    } catch (err) {
        console.log(err);
        if (err instanceof Error) {
            return reply.status(400).send({
                message: err.message,
            });
        }

        return reply.status(500).send({
            message: "Internal Server Error",
        });
    }
}

export async function handleSetProjectFields(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    try {
        const { id } = request.params as {
            id: string;
        };
        const { fields } = request.body as {
            fields: InputJsonObject;
        };

        if (!fields) {
            throw new Error("Missing fields");
        }

        const data = await setProjectFields({
            projectId: id,
            fields,
        });

        return reply.send({ data });
    } catch (err) {
        console.log(err);
        if (err instanceof Error) {
            return reply.status(400).send({
                message: err.message,
            });
        }

        return reply.status(500).send({
            message: "Internal Server Error",
        });
    }
}
