import { TeacherClassSubject, TeacherClassSubjectWithDetail } from "../types/teacher-class-subject-custom.type";

export class TeacherClassSubjectWithDetailBuilder {

    constructor(
        private readonly teacherClassSubject?: TeacherClassSubject,
        private id?: string,
        private classSubjectId?: string,
        private teacherId?: string,
        private teacher?: Record<string, any>,
        private createdAt?: Date,
        private updatedAt?: Date,
        private classSubject?: Record<string, any>
    ) {
        if (teacherClassSubject) {
            this.id = teacherClassSubject.id;
            this.classSubjectId = teacherClassSubject.classSubjectId,
            this.teacherId = teacherClassSubject.teacherId;
            this.teacher = teacherClassSubject.teacher;
            this.createdAt = teacherClassSubject.createdAt;
            this.updatedAt = teacherClassSubject.updatedAt;
        }
    }

    withClassSubject(classSubject: Record<string, any>): TeacherClassSubjectWithDetailBuilder {
        this.classSubject = classSubject;
        return this;
    }

    withTeacher(teacher: Record<string, any>): TeacherClassSubjectWithDetailBuilder {
        this.teacher = teacher;
        return this;
    }

    build(): TeacherClassSubjectWithDetail {
        return {
            id: this.id,
            classSubjectId: this.classSubjectId,
            teacherId: this.teacherId,
            teacher: this.teacher as any,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            classSubject: this.classSubject
        }
    }
}