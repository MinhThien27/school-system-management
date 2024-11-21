import { PartialType } from "@nestjs/swagger";
import { CreateStudentDto } from "./create-student.dto";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { Role } from "src/enums";

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
    @IsOptional()
    @IsString()
    @IsEnum(Role)
    role?: Role;
}