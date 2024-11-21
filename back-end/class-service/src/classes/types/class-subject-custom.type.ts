import { Prisma } from "@prisma/client";

export const classSubjectSelect = Prisma.validator<Prisma.ClassSubjectSelect>()({
    id: true,
    status: true,
    startDate: true,
    endDate: true,
    subjectId: true,
    semesterId: true,
    classId: true,
    class: true,
    createdAt: true,
    updatedAt: true
});

const classSubjectResponse = Prisma.validator<Prisma.ClassSubjectDefaultArgs>()({
    select: classSubjectSelect
});

export type ClassSubject = Prisma.ClassSubjectGetPayload<typeof classSubjectResponse>;

export type ClassSubjectWithDetail = ClassSubject & {
    subject: Record<string, any>,
    semester: Record<string, any>,
    teacherClassSubjects: Record<string, any>[],
    grades?: Record<string, any>[]
};