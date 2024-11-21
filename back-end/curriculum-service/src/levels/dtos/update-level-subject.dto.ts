import { PartialType } from "@nestjs/swagger";
import { CreateLevelSubjectDto } from "./create-level-subject.dto";

export class UpdateLevelSubjectDto extends PartialType(CreateLevelSubjectDto) {}