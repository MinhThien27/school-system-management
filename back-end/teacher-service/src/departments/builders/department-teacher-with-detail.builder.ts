import { DepartmentTeacher, DepartmentTeacherWithDetail } from "../types/department-teacher-custom.type";

export class DepartmentTeacherWithDetailBuilder {

    constructor(
        private readonly departmentTeacher?: DepartmentTeacher,
        private id?: string,
        private teacherId?: string,
        private departmentId?: string,
        private createdAt?: Date,
        private updatedAt?: Date,
        private teacher?: Record<string, any>,
        private department?: Record<string, any>,
        private availableSubjects?: Record<string, any>[],
    ) {
        if (departmentTeacher) {
            this.id = departmentTeacher.id;
            this.teacherId = departmentTeacher.teacherId;
            this.departmentId = departmentTeacher.departmentId;
            this.createdAt = departmentTeacher.createdAt;
            this.updatedAt = departmentTeacher.updatedAt;
            this.teacher = departmentTeacher.teacher;
            this.department = departmentTeacher.department;
            this.availableSubjects = departmentTeacher.availableSubjects;
        }
    }

    withTeacher(teacher: Record<string, any>): DepartmentTeacherWithDetailBuilder {
        this.teacher = teacher;
        return this;
    }
    
    withAvailableSubjects(availableSubjects: Record<string, any>[]): DepartmentTeacherWithDetailBuilder {
        this.availableSubjects = availableSubjects;
        return this;
    }

    build(): DepartmentTeacherWithDetail {
        return {
            id: this.id,
            teacherId: this.teacherId,
            departmentId: this.departmentId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            teacher: this.teacher as any,
            department: this.department as any,
            availableSubjects: this.availableSubjects as any,
        }
    }
}