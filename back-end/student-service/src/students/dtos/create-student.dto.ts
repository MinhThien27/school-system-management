import { Gender } from "@prisma/client";

export class CreateStudentDto {
    citizenIdentification: string;
    firstName: string;
    lastName: string;
    dob: string | Date;
    gender: Gender;
    phoneNumber: string;
    address: string;
    enrollmentDate: string | Date;
}