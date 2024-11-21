import { StudentWithDetail } from "../types/student-custom.type";

export class StudentFilterHelper {

    constructor(private readonly studentsWithDetail: StudentWithDetail[]) {}

    filterByAcademicYearId(academicYearId: string): StudentWithDetail[] {
        const studentsWithDetail: StudentWithDetail[] = [];
        for (const studentWithDetail of this.studentsWithDetail) {
            if (studentWithDetail.classStudents && studentWithDetail.classStudents.length) {
                let count = 0;
                for (const classStudent of studentWithDetail.classStudents) {
                    if (classStudent.class.academicYearId === academicYearId) count++;
                }
                if (count === 0) {
                    studentsWithDetail.push(studentWithDetail);
                }
            } else {
                studentsWithDetail.push(studentWithDetail);
            }
        }
        return studentsWithDetail;
    }
}