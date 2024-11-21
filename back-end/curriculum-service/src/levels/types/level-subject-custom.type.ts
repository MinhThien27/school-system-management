import { Prisma } from "@prisma/client";

export const levelSubjectSelect = Prisma.validator<Prisma.LevelSubjectSelect>()({
    id: true,
    semesterNumber: true,
    subjectId: true,
    levelId: true,
    level: true,
    createdAt: true,
    updatedAt: true
});

const levelSubjectResponse = Prisma.validator<Prisma.LevelSubjectDefaultArgs>()({
    select: levelSubjectSelect
});

export type LevelSubject = Prisma.LevelSubjectGetPayload<typeof levelSubjectResponse>;

export type LevelSubjectWithDetail = LevelSubject & {
    subject: Record<string, any>
};