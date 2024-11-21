import { Prisma } from "@prisma/client";

export const classStudentSelect = Prisma.validator<Prisma.ClassStudentSelect>()({
    id: true,
    studentId: true,
    classId: true,
    class: true,
    createdAt: true,
    updatedAt: true
});

const classStudentResponse = Prisma.validator<Prisma.ClassStudentDefaultArgs>()({
    select: classStudentSelect
});

export type ClassStudent = Prisma.ClassStudentGetPayload<typeof classStudentResponse>;

export type ClassStudentWithDetail = ClassStudent & {
    student: Record<string, any>
};