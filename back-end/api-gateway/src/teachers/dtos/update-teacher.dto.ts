import { PartialType } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { Role } from "src/enums";
import { CreateTeacherDto } from "./create-teacher.dto";

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {
    @IsOptional()
    @IsString()
    @IsEnum(Role)
    role?: Role;
}