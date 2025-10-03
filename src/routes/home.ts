import { FastifyInstance } from "fastify";
import { z } from "zod";

export default async function Home(app: FastifyInstance) {
    app.get(
        "/:id",
        {
            schema: {
                params: z.object({
                    id: z.string().min(1),
                }),
                response: {
                    200: z.object({
                        hello: z.string().min(5),
                    }),
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params as { id: string };

            return { hello: `Hello my dear ${id}` };
        }
    );
}
