import { Subject, SubjectWithDetail } from "../types/subject-custom.type";
import { $Enums } from "@prisma/client";

export class SubjectWithDetailBuilder {
    constructor(
        private readonly subject?: Subject,
        private id?: string,
        private name?: string,
        private description?: string,
        private status?: $Enums.Status,
        private createdAt?: Date,
        private updatedAt?: Date,
        private availableTeacherSubjects?: Record<string, any>[]
    ) {
        if (subject) {
            this.id = subject.id;
            this.name = subject.name;
            this.description = subject.description;
            this.status = subject.status;
            this.createdAt = subject.createdAt;
            this.updatedAt = subject.updatedAt;
        }
    }

    withAvailableTeacherSubjects(availableTeacherSubjects: Record<string, any>[]): SubjectWithDetailBuilder {
        this.availableTeacherSubjects = availableTeacherSubjects;
        return this;
    }

    build(): SubjectWithDetail {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            availableTeacherSubjects:  this.availableTeacherSubjects
        }
    }
}