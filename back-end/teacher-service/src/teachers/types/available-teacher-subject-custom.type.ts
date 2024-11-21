import { Prisma } from "@prisma/client";

export const availableTeacherSubjectSelect = Prisma.validator<Prisma.AvailableTeacherSubjectSelect>()({
    id: true,
    subjectId: true,
    departmentTeacherId: true,
    departmentTeacher: {
        select: {
            teacher: true
        }
    },
    createdAt: true,
    updatedAt: true
});

const availableTeacherSubjectResponse = Prisma.validator<Prisma.AvailableTeacherSubjectDefaultArgs>()({
    select: availableTeacherSubjectSelect
});

export type AvailableTeacherSubject = Prisma.AvailableTeacherSubjectGetPayload<typeof availableTeacherSubjectResponse>;

export type AvailableTeacherSubjectWithDetail = AvailableTeacherSubject & {
    subject: Record<string, any>
};