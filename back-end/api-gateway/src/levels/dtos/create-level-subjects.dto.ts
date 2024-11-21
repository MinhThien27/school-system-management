import { IsArray, IsOptional } from "class-validator";
import { CreateLevelSubjectDto } from "./create-level-subject.dto";
import { Type } from "class-transformer";

export class CreateLevelSubjectsDto {
    @IsOptional()
    @IsArray()
    @Type(() => CreateLevelSubjectDto)
    levelSubjectDtos: CreateLevelSubjectDto[]
}