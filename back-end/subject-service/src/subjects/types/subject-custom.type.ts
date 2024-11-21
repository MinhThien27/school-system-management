import { Prisma } from "@prisma/client";

export const subjectSelect = Prisma.validator<Prisma.SubjectSelect>()({
    id: true,
    name: true,
    description: true,
    status: true,
    createdAt: true,
    updatedAt: true
});

const subjectResponse = Prisma.validator<Prisma.SubjectDefaultArgs>()({
    select: subjectSelect
});

export type Subject = Prisma.SubjectGetPayload<typeof subjectResponse>;

export type SubjectWithDetail = Subject & {
    availableTeacherSubjects: Record<string, any>[]
};