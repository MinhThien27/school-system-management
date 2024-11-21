import { Injectable } from "@nestjs/common";
import { ClassStudentsRepository } from "../repositories/class-students.repository";
import { ClassStudent } from "../types/class-student-custom.type";

@Injectable()
export class ClassStudentSagaService {

    constructor(private readonly classStudentsRepository: ClassStudentsRepository) {}

    cancelCreateClassStudent(classStudentId: string): Promise<ClassStudent> {
        return this.classStudentsRepository.deleteClassStudent(classStudentId);
    }
}