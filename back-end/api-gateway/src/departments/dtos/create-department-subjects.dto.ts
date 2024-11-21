import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateDepartmentSubjectsDto {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    subjectIds?: string[]
}