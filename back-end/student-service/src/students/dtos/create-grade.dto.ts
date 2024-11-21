export interface CreateGradeForClassSubjectDto {
    studentIds?: string[];
    classSubjectId: string;
}

export interface CreateGradeForClassStudentDto {
    classSubjectIds?: string[];
    studentId: string;
}

export class CreateGradeDto {
    createGradeForClassSubjectDto?: CreateGradeForClassSubjectDto;
    createGradeForClassStudentDto?: CreateGradeForClassStudentDto;
}