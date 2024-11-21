import { IsDateString, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { IsAfterDate } from "src/decorators";
import { SemesterStatus as AcademicYearStatus } from '../../enums';

export class CreateAcademicYearDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsDateString()
    startDate: string;

    @IsNotEmpty()
    @IsDateString()
    @IsAfterDate('startDate', { message : 'End date must start after Start date' })
    endDate: string;

    @IsNotEmpty()
    @IsEnum(AcademicYearStatus)
    status: AcademicYearStatus;
}