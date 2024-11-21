import { Prisma } from "@prisma/client";

export const studentSelect = Prisma.validator<Prisma.StudentSelect>()({
    id: true,
    firstName: true,
    lastName: true,
    dob: true,
    gender: true,
    enrollmentDate: true,
    address: true,
    imageUrl: true,
    createdAt: true,
    updatedAt: true
});

const studentResponse = Prisma.validator<Prisma.StudentDefaultArgs>()({
    select: studentSelect
});

export type Student = Prisma.StudentGetPayload<typeof studentResponse>;

export type User = {
    _id?: string,
    email: string,
    role: string,
    citizenIdentification: string,
    phoneNumber: string
};

export type StudentWithUserInfos = Student & { user: User };

export type StudentWithDetail = StudentWithUserInfos & {
    classStudents: Record<string, any>[]
};