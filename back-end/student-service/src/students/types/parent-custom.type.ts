import { Prisma } from "@prisma/client";

export const parentSelect = Prisma.validator<Prisma.ParentSelect>()({
    id: true,
    firstName: true,
    lastName: true,
    dob: true,
    email: true,
    phoneNumber: true,
    studentId: true,
    student: true
});

const parentResponse = Prisma.validator<Prisma.ParentDefaultArgs>()({
    select: parentSelect
});

export type Parent = Prisma.ParentGetPayload<typeof parentResponse>;