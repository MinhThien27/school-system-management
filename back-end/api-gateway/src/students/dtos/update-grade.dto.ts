import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class UpdateGradeDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    oralTest?: number;
    
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    smallTest?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    bigTest?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    midtermExam?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    finalExam?: number;
}