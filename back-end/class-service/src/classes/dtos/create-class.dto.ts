import { Status } from "@prisma/client";

export class CreateClassDto {
    name: string;
    roomCode: string;
    capacity: number;
    academicYearId: string;
    status: Status;
    formTeacherId: string;
    levelId: string;
}