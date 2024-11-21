import { IsDateString, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { IsAfterDate } from "src/decorators";
import { SemesterStatus } from "src/enums";

export class CreateSemesterDto {
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
    @IsEnum(SemesterStatus)
    status: SemesterStatus;
}