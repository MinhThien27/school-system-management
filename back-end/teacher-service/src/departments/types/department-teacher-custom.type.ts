import { Prisma, Teacher } from "@prisma/client";
import { User } from "src/teachers/types/teacher-custom.type";

export const departmentTeacherSelect = Prisma.validator<Prisma.DepartmentTeacherSelect>()({
    id: true,
    teacherId: true,
    teacher: true,
    departmentId: true,
    department: {
        include: {
            headTeacher: true
        }
    },
    availableSubjects: {
        select: {
            subjectId: true
        }
    },
    createdAt: true,
    updatedAt: true
});

const departmentTeacherResponse = Prisma.validator<Prisma.DepartmentTeacherDefaultArgs>()({
    select: departmentTeacherSelect
});

export type DepartmentTeacher = Prisma.DepartmentTeacherGetPayload<typeof departmentTeacherResponse>;

export type DepartmentTeacherWithDetail = Omit<DepartmentTeacher, 'teacher' | 'availableSubjects'> & {
    teacher: Teacher & { user: User },
    availableSubjects: {
        subjectId: string,
        subject: Record<string, any>
    }[]
};