import { IsOptional, IsString } from "class-validator";

export class CreateStudentDetailDto {
    @IsOptional()
    @IsString()
    hobbies?: string;

    @IsOptional()
    @IsString()
    achievements?: string; 
}