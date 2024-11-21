import { Prisma } from "@prisma/client";

export const levelSelect = Prisma.validator<Prisma.LevelSelect>()({
    id: true,
    levelNumber: true,
    createdAt: true,
    updatedAt: true
});

const levelResponse = Prisma.validator<Prisma.LevelDefaultArgs>()({
    select: levelSelect
});

export type Level = Prisma.LevelGetPayload<typeof levelResponse>;