import { Status } from "@prisma/client";

export class CreateSubjectDto {
    name: string;
    description?: string;
    status: Status;
}