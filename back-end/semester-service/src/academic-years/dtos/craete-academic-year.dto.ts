import { Status } from "@prisma/client";

export class CreateAcademicYearDto {
    name: string;
    startDate: string;
    endDate: string;
    status: Status;
}