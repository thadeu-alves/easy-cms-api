import { FastifyInstance } from "fastify";
import { object, z } from "zod";
import { prisma } from "../../lib/prisma";
import { InputJsonObject } from "@prisma/client/runtime/library";

export default async function Projects(
    app: FastifyInstance,
) {
    app.get(
        "/:id",
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
        async (request, reply) => {
            try {
                const { id } = request.params as {
                    id: string;
                };

                const data = await prisma.project.findFirst(
                    {
                        where: {
                            id,
                        },
                    },
                );

                if (!data) {
                    throw new Error("Project not found");
                }

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
        },
    );

    app.post(
        "/:id",
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
        async (request, reply) => {
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

                const data = await prisma.project.findFirst(
                    {
                        where: {
                            id,
                        },
                    },
                );

                if (!data) {
                    throw new Error("Project not found");
                }

                const updatedData =
                    await prisma.project.update({
                        where: {
                            id,
                        },
                        data: {
                            fields,
                        },
                    });

                return reply.send({ data: updatedData });
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
        },
    );
}
