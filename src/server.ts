import Fastify from "fastify";
import Projects from "./routes/projects";
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";

const app = Fastify({
    logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
    origin: true,
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "EasyCMS API",
            description: "Easy CMS for your usage",
            version: "1.0.0",
        },
    },
    transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
});

app.register(Projects);

export default async (req: any, res: any) => {
    try {
        await app.ready();
        app.server.emit("request", req, res);
    } catch (err) {
        console.error("Erro na função:", err);
        res.status(500).send("Internal Server Error");
    }
};

if (require.main === module) {
    const start = async () => {
        try {
            await app.listen({
                port: 3000,
                host: "0.0.0.0",
            });
            console.log(
                "Server listening on http://localhost:3000",
            );
        } catch (err) {
            app.log.error(err);
            process.exit(1);
        }
    };

    start();
}
