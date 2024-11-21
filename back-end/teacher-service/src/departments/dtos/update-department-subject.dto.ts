import { PartialType } from "@nestjs/swagger";
import { CreateDepartmentSubjectDto } from "./create-department-subject.dto";

export class UpdateDepartmentSubjectDto extends PartialType(CreateDepartmentSubjectDto) {}