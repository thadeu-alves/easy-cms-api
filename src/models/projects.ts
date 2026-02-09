import { InputJsonObject } from "@prisma/client/runtime/library";
import { prisma } from "../../lib/prisma";
import { ProjectProps } from "../types/project";

export async function getAllProjects() {
    const project = await prisma.project.findMany();

    return project;
}

export async function getProjectById(projectId: string) {
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
        },
    });

    if (!project) {
        throw new Error("Project not found");
    }

    return project;
}

export async function createProject({
    name,
    slug,
    title,
    description,
    featuredImage,
    fields,
}: ProjectProps) {
    const existingProjectWithSlug =
        await prisma.project.findFirst({
            where: {
                slug,
            },
        });

    if (existingProjectWithSlug) {
        throw new Error("Another project have this slug");
    }

    const project = await prisma.project.create({
        data: {
            name,
            slug,
            title: title || null,
            description: description || null,
            featuredImage: featuredImage || null,
            fields: fields || {},
        },
    });

    if (!project) {
        throw new Error("Impossible to create Project");
    }

    return project;
}

export async function setProjectFields({
    projectId,
    fields,
}: {
    projectId: string;
    fields: InputJsonObject;
}) {
    const project = await getProjectById(projectId);

    const updatedProjectFields =
        await prisma.project.update({
            where: {
                id: project.id,
            },
            data: {
                fields,
            },
        });

    if (!updatedProjectFields) {
        throw new Error("Impossible to set Project Fields");
    }

    return updatedProjectFields;
}
