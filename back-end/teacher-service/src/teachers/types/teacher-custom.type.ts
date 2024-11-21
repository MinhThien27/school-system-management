import { Prisma } from "@prisma/client";

export const teacherSelect = Prisma.validator<Prisma.TeacherSelect>()({
    id: true,
    firstName: true,
    lastName: true,
    dob: true,
    gender: true,
    startDate: true,
    address: true,
    imageUrl: true,
    createdAt: true,
    updatedAt: true,
    departmentTeachers: {
        include: {
            department: {
                include: {
                    headTeacher: true
                }
            }
        }
    }
});

const teacherResponse = Prisma.validator<Prisma.TeacherDefaultArgs>()({
    select: teacherSelect
});

export type Teacher = Prisma.TeacherGetPayload<typeof teacherResponse>;

export type User = {
    _id?: string,
    email: string,
    role: string,
    citizenIdentification: string,
    phoneNumber: string
};

export type TeacherWithUserInfos = Teacher & { user: User };

export type TeacherWithDetail = TeacherWithUserInfos;