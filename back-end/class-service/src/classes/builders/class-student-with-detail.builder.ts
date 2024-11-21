import { ClassStudent, ClassStudentWithDetail } from "../types/class-student-custom.type";

export class ClassStudentWithDetailBuilder {

    constructor(
        private readonly classStudent?: ClassStudent,
        private id?: string,
        private studentId?: string,
        private classId?: string,
        private _class?: Record<string, any>,
        private createdAt?: Date,
        private updatedAt?: Date,
        private student?: Record<string, any>
    ) {
        if (classStudent) {
            this.id = classStudent.id;
            this.studentId = classStudent.studentId;
            this.classId = classStudent.classId;
            this._class = classStudent.class;
            this.createdAt = classStudent.createdAt;
            this.updatedAt = classStudent.updatedAt;
        }
    }

    withStudent(student: Record<string, any>): ClassStudentWithDetailBuilder {
        this.student = student;
        return this;
    }

    withClass(_class: Record<string, any>): ClassStudentWithDetailBuilder {
        this._class = _class;
        return this;
    }

    build(): ClassStudentWithDetail {
        return {
            id: this.id,
            studentId: this.studentId,
            classId: this.classId,
            class: this._class as any,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            student: this.student
        }
    }
}