import { IsNotEmpty, IsString } from "class-validator";

export class CreateTeacherClassSubjectDto {
    @IsNotEmpty()
    @IsString()
    classSubjectId: string;
}