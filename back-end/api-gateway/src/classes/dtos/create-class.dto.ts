import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ClassStatus } from "src/enums";

export class CreateClassDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    roomCode: string;

    @IsNotEmpty()
    @IsNumber()
    capacity: number;

    @IsNotEmpty()
    @IsString()
    academicYearId: string;

    @IsNotEmpty()
    @IsEnum(ClassStatus)
    status: ClassStatus;

    @IsNotEmpty()
    @IsString()
    formTeacherId: string;

    @IsNotEmpty()
    @IsString()
    levelId: string;
}