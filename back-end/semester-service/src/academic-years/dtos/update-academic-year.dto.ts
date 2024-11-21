import { PartialType } from "@nestjs/swagger";
import { CreateAcademicYearDto } from "./craete-academic-year.dto";

export class UpdateAcademicYearDto extends PartialType(CreateAcademicYearDto) {}