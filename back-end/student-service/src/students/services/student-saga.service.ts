import { Injectable } from "@nestjs/common";
import { StudentsRepository } from "../repositories/students.repository";
import { UpdateStudentImageUrlDto } from "../dtos/update-student-image-url.dto";
import { Student } from "@prisma/client";

@Injectable()
export class StudentSagaService {

    constructor(private readonly studentsRepository: StudentsRepository) {}

    cancelCreateStudent(studentId: string): Promise<Student> {
        return this.studentsRepository.deleteStudent(studentId);
    }

    updateStudentImageUrl(updateStudentImageUrlDto: UpdateStudentImageUrlDto): Promise<Student> {
        const { studentId, imageUrl } = updateStudentImageUrlDto;
        return this.studentsRepository.updateStudent(studentId, {}, imageUrl);
    }

    cancelUpdateStudent(student: Student): Promise<Student> {
        const { id, imageUrl, ...updateStudent } = student;
        return this.studentsRepository.updateStudent(id, updateStudent, imageUrl);
    }

    cancelDeleteStudent(student: Student): Promise<Student> {
        const { id, imageUrl, ...createStudent } = student;
        return this.studentsRepository.createStudent(id, createStudent, imageUrl);
    }
}