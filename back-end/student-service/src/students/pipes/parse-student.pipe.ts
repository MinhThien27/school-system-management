import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { StudentsRepository } from "../repositories/students.repository";
import { Student } from "../types/student-custom.type";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class ParseStudentPipe implements PipeTransform<string, Promise<Student>> {

    constructor(private readonly studentsRepository: StudentsRepository) {}

    async transform(studentId: string): Promise<Student> {
        const student = await this.studentsRepository.findUniqueStudent({ id: studentId });
        if (!student) {
            throw new RpcException({ message: `Student id ${studentId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        return student;
    }
}