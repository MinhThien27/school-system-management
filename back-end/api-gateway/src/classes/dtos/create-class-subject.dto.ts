import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ClassStatus as ClassSubjectStatus } from '../../enums';

export class CreateClassSubjectDto {
    @IsNotEmpty()
    @IsEnum(ClassSubjectStatus)
    status: ClassSubjectStatus;

    @IsOptional()
    @IsDateString()
    startDate: string;

    @IsOptional()
    @IsDateString()
    endDate: string;

    @IsNotEmpty()
    @IsString()
    subjectId: string;

    @IsNotEmpty()
    @IsString()
    semesterId: string;
}