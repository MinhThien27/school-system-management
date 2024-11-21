import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateLevelSubjectDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    semesterNumber: number;

    @IsNotEmpty()
    @IsString()
    subjectId: string;
}