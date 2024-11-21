import { PartialType } from "@nestjs/swagger";
import { CreateLevelSubjectsDto } from "./create-level-subjects.dto";

export class UpdateLevelSubjectsDto extends PartialType(CreateLevelSubjectsDto) {}