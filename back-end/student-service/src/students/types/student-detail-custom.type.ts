import { Prisma } from "@prisma/client";

export const studentDetailSelect = Prisma.validator<Prisma.StudentDetailSelect>()({
    id: true,
    hobbies: true,
    achievements: true,
    studentId: true,
    student: true
});

const studentDetailResponse = Prisma.validator<Prisma.StudentDetailDefaultArgs>()({
    select: studentDetailSelect
});

export type StudentDetail = Prisma.StudentDetailGetPayload<typeof studentDetailResponse>;