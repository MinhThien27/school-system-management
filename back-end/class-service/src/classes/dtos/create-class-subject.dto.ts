import { Status } from "@prisma/client";

export class CreateclassSubjectDto {
    status: Status;
    startDate?: string | Date;
    endDate?: string | Date;
    subjectId: string;
    semesterId: string;
}