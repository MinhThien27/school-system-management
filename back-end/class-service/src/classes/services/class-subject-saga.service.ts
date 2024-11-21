import { Injectable } from "@nestjs/common";
import { ClassSubjectsRepository } from "../repositories/class-subjects.repository";
import { ClassSubject } from "../types/class-subject-custom.type";

@Injectable()
export class ClassSubjectSagaService {

    constructor(private readonly classSubjectsRepository: ClassSubjectsRepository) {}

    cancelCreateClassSubject(classSubjectId: string): Promise<ClassSubject> {
        return this.classSubjectsRepository.deleteClassSubject(classSubjectId);
    }
}