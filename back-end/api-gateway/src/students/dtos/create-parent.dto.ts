import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsValidVNPhoneNumber } from "src/decorators";

export class CreateParentDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsDateString()
    dob: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @IsValidVNPhoneNumber({ message: 'phoneNumber must be a valid phone number in Vietnam' })
    phoneNumber?: string
}