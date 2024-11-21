import { PartialType } from "@nestjs/swagger";
import { CreateDepartmentSubjectsDto } from "./create-department-subjects.dto";

export class UpdateDepartmentSubjectsDto extends PartialType(CreateDepartmentSubjectsDto) {}