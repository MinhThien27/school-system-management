import { PartialType } from "@nestjs/swagger";
import { CreateclassSubjectDto } from "./create-class-subject.dto";

export class UpdateClassSubjectDto extends PartialType(CreateclassSubjectDto) {}