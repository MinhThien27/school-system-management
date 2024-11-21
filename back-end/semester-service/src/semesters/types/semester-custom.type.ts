import { Prisma } from "@prisma/client";

export const semesterSelect = Prisma.validator<Prisma.SemesterSelect>()({
    id: true,
    name: true,
    semesterNumber: true,
    startDate: true,
    endDate: true,
    academicYearId: true,
    academicYear: true,
    status: true,
    createdAt: true,
    updatedAt: true
});

const semesterResponse = Prisma.validator<Prisma.SemesterDefaultArgs>()({
    select: semesterSelect
});

export type Semester = Prisma.SemesterGetPayload<typeof semesterResponse>;