import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UpdateGradeDto } from "src/students/dtos/update-grade.dto";

class GradeDto {
    @IsNotEmpty()
    @IsString()
    studentId: string;

    @IsOptional()
    @Type(() => UpdateGradeDto)
    updateGradeDto: UpdateGradeDto;
}

export class UpdateGradesDto {
    @IsOptional()
    @IsArray()
    @Type(() => GradeDto)
    gradesDto?: GradeDto[]
}