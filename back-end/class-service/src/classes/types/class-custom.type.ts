import { Prisma } from "@prisma/client";

export const classSelect = Prisma.validator<Prisma.ClassSelect>()({
    id: true,
    name: true,
    roomCode: true,
    capacity: true,
    academicYearId: true,
    status: true,
    levelId: true,
    formTeacherId: true,
    createdAt: true,
    updatedAt: true
});

const classResponse = Prisma.validator<Prisma.ClassDefaultArgs>()({
    select: classSelect
});

export type Class = Prisma.ClassGetPayload<typeof classResponse>;

export type ClassWithDetail = Class & {
    academicYear: Record<string, any>,
    level: Record<string, any>,
    formTeacher: Record<string, any>
};