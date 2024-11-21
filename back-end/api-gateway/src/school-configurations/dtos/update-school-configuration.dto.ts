import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateSchoolConfigurationDto {
    @IsOptional()
    @IsString()
    schoolName?: string;

    @IsOptional()
    @IsNumber()
    numberOfSemesters?: number;

    @IsOptional()
    @IsNumber()
    numberOfRooms?: number;

    @IsOptional()
    @IsNumber()
    numberOfTeachers?: number;

    @IsOptional()
    @IsNumber()
    numberOfStudents?: number;
}