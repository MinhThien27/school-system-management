import { UpdateGradeDto } from "./update-grade.dto";

class GradeDto {
    studentId: string;
    updateGradeDto: UpdateGradeDto;
}

export class UpdateGradesDto {
    gradesDto?: GradeDto[]
}