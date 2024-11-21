import { IsOptional, IsString } from "class-validator";

export class CreateDepartmentSubjectDto {
    @IsOptional()
    @IsString()
    subjectId?: string;
}