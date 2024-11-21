import { IsDateString, IsEnum, IsNotEmpty, IsNumberString, IsString } from "class-validator";
import { IsValidVNCitizenIdentification, IsValidVNPhoneNumber } from "src/decorators";
import { Gender } from "src/enums";

export class CreateTeacherDto {
    @IsNotEmpty()
    @IsString()
    @IsValidVNCitizenIdentification({ message: 'citizenIdentification must be a citizen identification in Vietnam' })
    citizenIdentification: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsDateString()
    dob: string;

    @IsNotEmpty()
    @IsEnum(Gender)
    gender: Gender;

    @IsNotEmpty()
    @IsNumberString()
    @IsValidVNPhoneNumber({ message: 'phoneNumber must be a valid phone number in Vietnam' })
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsDateString()
    startDate: string;
}