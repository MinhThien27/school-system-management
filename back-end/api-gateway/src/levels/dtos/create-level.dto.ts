import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class CreateLevelDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(12)
    levelNumber: number;
}