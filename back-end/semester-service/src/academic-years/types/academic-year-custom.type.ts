import { Prisma } from "@prisma/client";

export const academicYearSelect = Prisma.validator<Prisma.AcademicYearSelect>()({
    id: true,
    name: true,
    numberOfSemesters: true,
    startDate: true,
    endDate: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    semesters: true
});

const academicYearResponse = Prisma.validator<Prisma.AcademicYearDefaultArgs>()({
    select: academicYearSelect
});

export type AcademicYear = Prisma.AcademicYearGetPayload<typeof academicYearResponse>;