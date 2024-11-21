import { Status } from "@prisma/client";

export class CreateSemesterDto {
    name: string;
    startDate: string;
    endDate: string;
    status: Status;
}