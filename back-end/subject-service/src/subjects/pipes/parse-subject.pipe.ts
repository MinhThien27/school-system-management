import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { SubjectsRepository } from "../repositories/subjects.repository";
import { RpcException } from "@nestjs/microservices";
import { Subject } from "../types/subject-custom.type";

@Injectable()
export class ParseSubjectPipe implements PipeTransform<string, Promise<Subject>> {

    constructor(private readonly subjectsRepository: SubjectsRepository) {}

    async transform(id: string): Promise<Subject> {
        const subject = await this.subjectsRepository.findUniqueSubject({ id });
        if (!subject) {
            throw new RpcException({ message: `Subject id ${id} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        return subject;
    }
}