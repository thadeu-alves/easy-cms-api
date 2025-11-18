import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export default async function Medias(app: FastifyInstance) {
    app.get("/images/:id", async (request, reply) => {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "GET");
        try {
            const { id } = request.params as {
                id: string;
            };

            const image = await prisma.image.findUnique({
                where: { id },
            });

            if (!image) {
                return reply.status(404).send({
                    error: "Imagem não encontrada",
                });
            }

            reply.header("Content-Type", image.mimeType);
            reply.header(
                "Content-Disposition",
                `inline; filename="${image.name}"`,
            );

            return reply.send(image.imageData);
        } catch (error) {
            console.error("Erro ao buscar imagem:", error);
            return reply.status(500).send({
                error: "Erro interno do servidor",
            });
        }
    });

    app.post("/images", async (request, reply) => {
        try {
            const file = await request.file();

            if (!file) {
                return reply.status(400).send({
                    error: "Nenhum arquivo enviado",
                });
            }

            const buffer = await file.toBuffer();
            const mimeType = file.mimetype;
            const fileName = file.filename;

            const data = await prisma.image.create({
                data: {
                    name: fileName,
                    imageData: buffer,
                    mimeType: mimeType,
                },
            });

            return reply.status(201).send({
                data,
            });
        } catch (error) {
            console.error("Erro no upload:", error);
            return reply.status(500).send({
                error: "Erro interno do servidor",
            });
        }
    });
}
