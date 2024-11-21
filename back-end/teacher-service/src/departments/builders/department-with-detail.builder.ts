import { Department, DepartmentWithDetail } from "../types/department-custom.type";

export class DepartmentWithDetailBuilder {

    constructor(
        private readonly department?: Department,
        private id?: string,
        private name?: string,
        private description?: string,
        private headTeacherId?: string,
        private createdAt?: Date,
        private updatedAt?: Date,
        private headTeacher?: Record<string, any>,
    ) {
        if (department) {
            this.id = department.id;
            this.name = department.name;
            this.description = department.description;
            this.headTeacherId = department.headTeacherId;
            this.createdAt = department.createdAt;
            this.updatedAt = department.udpatedAt;
            this.headTeacher = department.headTeacher;
        }
    }

    withHeadTeacher(headTeacher: Record<string, any>): DepartmentWithDetailBuilder {
        this.headTeacher = headTeacher;
        return this;
    }

    build(): DepartmentWithDetail {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            headTeacherId: this.headTeacherId,
            createdAt: this.createdAt,
            udpatedAt: this.updatedAt,
            headTeacher: this.headTeacher as any,
        }
    }
}