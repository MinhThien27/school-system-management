import { Prisma, Teacher } from "@prisma/client";
import { User } from "src/teachers/types/teacher-custom.type";

export const departmentSelect = Prisma.validator<Prisma.DepartmentSelect>()({
    id: true,
    name: true,
    description: true,
    headTeacherId: true,
    headTeacher: true,
    createdAt: true,
    udpatedAt: true
});

const departmentResponse = Prisma.validator<Prisma.DepartmentDefaultArgs>()({
    select: departmentSelect
});

export type Department = Prisma.DepartmentGetPayload<typeof departmentResponse>;

export type DepartmentWithDetail = Omit<Department, 'headTeacher'> & {
    headTeacher: Teacher & { user: User }
}