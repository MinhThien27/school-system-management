import { LevelSubject, LevelSubjectWithDetail } from "../types/level-subject-custom.type";

export class LevelSubjectWithDetailBuilder {

    constructor(
        private readonly levelSubject?: LevelSubject,
        private id?: string,
        private semesterNumber?: number,
        private subjectId?: string,
        private levelId?: string,
        private level?: Record<string, any>,
        private createdAt?: Date,
        private updatedAt?: Date,
        private subject?: Record<string, any>
    ) {
        if (levelSubject) {
            this.id = levelSubject.id;
            this.semesterNumber = levelSubject.semesterNumber;
            this.subjectId = levelSubject.subjectId;
            this.levelId = levelSubject.levelId;
            this.level = levelSubject.level;
            this.createdAt = levelSubject.createdAt;
            this.updatedAt = levelSubject.updatedAt;
        }
    }

    withSubject(subject: Record<string, any>): LevelSubjectWithDetailBuilder {
        this.subject = subject;
        return this;
    }

    build(): LevelSubjectWithDetail {
        return {
            id: this.id,
            semesterNumber: this.semesterNumber,
            subjectId: this.subjectId,
            levelId: this.levelId,
            level: this.level as any,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            subject: this.subject
        }
    }
}