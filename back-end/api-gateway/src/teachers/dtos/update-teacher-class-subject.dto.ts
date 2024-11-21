import { PartialType } from "@nestjs/swagger";
import { CreateTeacherClassSubjectDto } from "./create-teacher-class-subject.dto";

export class UpdateTeacherClassSubjectDto extends PartialType(CreateTeacherClassSubjectDto) {}