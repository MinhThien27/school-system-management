import { DepartmentSubject, DepartmentSubjectWithDetail } from "../types/department-subject-custom.type";

export class DepartmentSubjectWithDetailBuilder {

    constructor(
        private readonly departmentSubject?: DepartmentSubject,
        private id?: string,
        private subjectId?: string,
        private departmentId?: string,
        private createdAt?: Date,
        private updatedAt?: Date,
        private subject?: Record<string, any>,
        private department?: Record<string, any>
    ) {
        if (departmentSubject) {
            this.id = departmentSubject.id;
            this.subjectId = departmentSubject.subjectId;
            this.departmentId = departmentSubject.departmentId;
            this.createdAt = departmentSubject.createdAt;
            this.updatedAt = departmentSubject.updatedAt;
            this.department = departmentSubject.department;
        }
    }

    withSubject(subject: Record<string, any>): DepartmentSubjectWithDetailBuilder {
        this.subject = subject;
        return this;
    }

    build(): DepartmentSubjectWithDetail {
        return {
            id: this.id,
            subjectId: this.subjectId,
            departmentId: this.departmentId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            subject: this.subject as any,
            department: this.department as any
        }
    }
}