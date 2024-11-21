import { PartialType } from "@nestjs/swagger";
import { CreateDepartmentTeacherDto } from "./create-department-teacher.dto";

export class UpdateDepartmentTeacherDto extends PartialType(CreateDepartmentTeacherDto) {}