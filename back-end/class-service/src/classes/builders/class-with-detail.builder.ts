import { $Enums } from "@prisma/client";
import { Class, ClassWithDetail } from "../types/class-custom.type";

export class ClassWithDetailBuilder {

    constructor(
        private readonly _class?: Class,
        private id?: string,
        private name?: string,
        private roomCode?: string,
        private capacity?: number,
        private academicYearId?: string,
        private status?: $Enums.Status,
        private levelId?: string,
        private formTeacherId?: string,
        private createdAt?: Date,
        private updatedAt?: Date,
        private academicYear?: Record<string, any>,
        private level?: Record<string, any>,
        private formTeacher?: Record<string, any>
    ) {
        if (_class) {
            this.id = _class.id;
            this.name = _class.name;
            this.roomCode = _class.roomCode;
            this.capacity = _class.capacity;
            this.academicYearId = _class.academicYearId;
            this.status = _class.status;
            this.levelId = _class.levelId;
            this.formTeacherId = _class.formTeacherId;
            this.createdAt = _class.createdAt;
            this.updatedAt = _class.updatedAt;
        }
    }

    withAcademicYear(academicYear: Record<string, any>): ClassWithDetailBuilder {
        this.academicYear = academicYear;
        return this;
    }

    withLevel(Level: Record<string, any>): ClassWithDetailBuilder {
        this.level = Level;
        return this;
    }

    withFormTeacher(formTeacher: Record<string, any>): ClassWithDetailBuilder {
        this.formTeacher = formTeacher;
        return this;
    }

    build(): ClassWithDetail {
        return {
            id: this.id,
            name: this.name,
            roomCode: this.roomCode,
            capacity: this.capacity,
            academicYearId: this.academicYearId,
            status: this.status,
            levelId: this.levelId,
            formTeacherId: this.formTeacherId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            academicYear: this.academicYear,
            level: this.level,
            formTeacher: this.formTeacher
        }
    }
}