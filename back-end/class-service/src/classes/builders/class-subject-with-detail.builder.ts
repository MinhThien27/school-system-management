import { $Enums } from "@prisma/client";
import { ClassSubject, ClassSubjectWithDetail } from "../types/class-subject-custom.type";

export class ClassSubjectWithDetailBuilder {

    constructor(
        private readonly classSubject?: ClassSubject,
        private id?: string,
        private status?: $Enums.Status,
        private startDate?: Date,
        private endDate?: Date,
        private subjectId?: string,
        private semesterId?: string,
        private classId?: string,
        private _class?: Record<string, any>,
        private createdAt?: Date,
        private updatedAt?: Date,
        private subject?: Record<string, any>,
        private semester?: Record<string, any>,
        private teacherClassSubjects?: Record<string, any>[]
    ) {
        if (classSubject) {
            this.id = classSubject.id;
            this.status = classSubject.status;
            this.startDate = classSubject.startDate;
            this.endDate = classSubject.endDate;
            this.subjectId = classSubject.subjectId;
            this.semesterId = classSubject.semesterId;
            this.classId = classSubject.classId;
            this._class = classSubject.class;
            this.createdAt = classSubject.createdAt;
            this.updatedAt = classSubject.updatedAt;
        }
    }

    withSubject(subject: Record<string, any>): ClassSubjectWithDetailBuilder {
        this.subject = subject;
        return this;
    }

    withSemester(semester: Record<string, any>): ClassSubjectWithDetailBuilder {
        this.semester = semester;
        return this;
    }

    withTeacherClassSubjects(teacherClassSubjects: Record<string, any>[]): ClassSubjectWithDetailBuilder {
        this.teacherClassSubjects = teacherClassSubjects;
        return this;
    }

    withClass(_class: Record<string, any>): ClassSubjectWithDetailBuilder {
        this._class = _class;
        return this;
    }

    build(): ClassSubjectWithDetail {
        return {
            id: this.id,
            status: this.status,
            startDate: this.startDate,
            endDate: this.endDate,
            subjectId: this.subjectId,
            semesterId: this.semesterId,
            classId: this.classId,
            class: this._class as any,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            subject: this.subject,
            semester: this.semester,
            teacherClassSubjects: this.teacherClassSubjects
        }
    }
}