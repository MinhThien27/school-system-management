import { IsNotEmpty, IsString } from "class-validator";

export class CreateClassStudentDto {
    @IsNotEmpty()
    @IsString()
    studentId: string;
}