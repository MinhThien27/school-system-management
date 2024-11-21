import { Grade, GradeWithDetail } from "../types/grade-custom.type";

export class GradeWithDetailBuilder {

    constructor(
        private readonly grade?: Grade,
        private id?: string,
        private oralTest?: number,
        private smallTest?: number,
        private bigTest?: number,
        private midtermExam?: number,
        private finalExam?: number,
        private subjectAverage?: number,
        private classSubjectId?: string,
        private studentId?: string,
        private student?: Record<string, any>,
        private classSubject?: Record<string, any>
    ) {
        if (grade) {
            this.id = grade.id;
            this.oralTest = grade.oralTest;
            this.smallTest = grade.smallTest;
            this.bigTest = grade.bigTest;
            this.midtermExam = grade.midtermExam;
            this.finalExam = grade.finalExam;
            this.subjectAverage = grade.subjectAverage;
            this.classSubjectId = grade.classSubjectId;
            this.studentId = grade.studentId;
            this.student = grade.student;
        }
    }

    withClassSubject(classSubject: Record<string, any>): GradeWithDetailBuilder {
        this.classSubject = classSubject;
        return this;
    }

    build(): GradeWithDetail {
        return {
            id: this.id,
            oralTest: this.oralTest,
            smallTest: this.smallTest,
            bigTest: this.bigTest,
            midtermExam: this.midtermExam,
            finalExam: this.finalExam,
            subjectAverage: this.subjectAverage,
            classSubjectId: this.classSubjectId,
            studentId: this.studentId,
            student: this.student as any,
            classSubject: this.classSubject
        }
    }
}