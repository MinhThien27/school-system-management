import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { ClassStudentsRepository } from "../repositories/class-students.repository";
import { ClassStudent } from "../types/class-student-custom.type";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class ParseClassStudentPipe implements PipeTransform<string, Promise<ClassStudent>> {

    constructor(private readonly classStudentsRepository: ClassStudentsRepository) {}

    async transform(classStudentId: string): Promise<ClassStudent> {
        const classStudent = await this.classStudentsRepository.findUniqueClassStudent({ id: classStudentId });
        if (!classStudent) {
            throw new RpcException({ message: `Class student id ${classStudentId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        return classStudent;
    }
}