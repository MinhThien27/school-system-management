import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SubjectStatus } from "src/enums";

export class CreateSubjectDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsEnum(SubjectStatus)
    status: SubjectStatus;
}