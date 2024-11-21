import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { Teacher } from "../types/teacher-custom.type";
import { TeachersRepository } from "../repositories/teachers.repository";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class ParseTeacherPipe implements PipeTransform<string, Promise<Teacher>> {

    constructor(private readonly teachersRepository: TeachersRepository) {}

    async transform(teacherId: string): Promise<Teacher> {
        const teacher = await this.teachersRepository.findUniqueTeacher({ id: teacherId });
        if (!teacher) {
            throw new RpcException({ message: `Teacher id ${teacherId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        return teacher;
    }
}