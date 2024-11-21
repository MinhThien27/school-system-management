import { Prisma } from "@prisma/client";

export const departmentSubjectSelect = Prisma.validator<Prisma.DepartmentSubjectSelect>()({
    id: true,
    subjectId: true,
    departmentId: true,
    department: true,
    createdAt: true,
    updatedAt: true
});

const departmentSubjectResponse = Prisma.validator<Prisma.DepartmentSubjectDefaultArgs>()({
    select: departmentSubjectSelect
});

export type DepartmentSubject = Prisma.DepartmentSubjectGetPayload<typeof departmentSubjectResponse>;

export type DepartmentSubjectWithDetail = DepartmentSubject & {
    subject: Record<string, any>
};