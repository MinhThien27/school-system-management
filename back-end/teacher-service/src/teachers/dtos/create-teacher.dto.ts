import { Gender } from "@prisma/client";

export class CreateTeacherDto {
    citizenIdentification: string;
    firstName: string;
    lastName: string;
    dob: string | Date;
    gender: Gender;
    phoneNumber: string;
    address: string;
    startDate: string | Date;
}