import { Prisma } from "@prisma/client";

export const teacherClassSubjectSelect = Prisma.validator<Prisma.TeacherClassSubjectSelect>()({
    id: true,
    classSubjectId: true,
    teacherId: true,
    teacher: true,
    createdAt: true,
    updatedAt: true
});

const teacherClassSubjectResponse = Prisma.validator<Prisma.TeacherClassSubjectDefaultArgs>()({
    select: teacherClassSubjectSelect
});

export type TeacherClassSubject = Prisma.TeacherClassSubjectGetPayload<typeof teacherClassSubjectResponse>;

export type TeacherClassSubjectWithDetail = TeacherClassSubject & {
    classSubject: Record<string, any>
};