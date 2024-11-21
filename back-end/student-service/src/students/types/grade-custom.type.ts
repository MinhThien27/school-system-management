import { Prisma } from "@prisma/client";

export const gradeSelect = Prisma.validator<Prisma.GradeSelect>()({
    id: true,
    oralTest: true,
    smallTest: true,
    bigTest: true,
    midtermExam: true,
    finalExam: true,
    subjectAverage: true,
    classSubjectId: true,
    studentId: true,
    student: true
});

const gradeResponse = Prisma.validator<Prisma.GradeDefaultArgs>()({
    select: gradeSelect
});

export type Grade = Prisma.GradeGetPayload<typeof gradeResponse>;

export type GradeWithDetail = Grade & {
    classSubject: Record<string, any>
};