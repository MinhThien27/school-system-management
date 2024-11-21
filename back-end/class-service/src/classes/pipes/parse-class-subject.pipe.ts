import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { ClassSubjectsRepository } from "../repositories/class-subjects.repository";
import { ClassSubject } from "../types/class-subject-custom.type";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class ParseClassSubjectPipe implements PipeTransform<string, Promise<ClassSubject>> {

    constructor(private readonly classSubjectsRepository: ClassSubjectsRepository) {}

    async transform(classSubjectId: string): Promise<ClassSubject> {
        const classSubject = await this.classSubjectsRepository.findUniqueClassSubject({ id: classSubjectId });
        if (!classSubject) {
            throw new RpcException({ message: `Class subject id ${classSubjectId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        return classSubject;
    }
}