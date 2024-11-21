import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDepartmentTeacherDto {
    @IsNotEmpty()
    @IsString()
    teacherId: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    subjectIds?: string[]
}