import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { SubjectsRepository } from "../repositories/subjects.repository";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class CheckDuplicateSubjectPipe implements PipeTransform<Record<string, any>, Promise<Record<string, any>>> {

    constructor(private readonly subjectsRepository: SubjectsRepository) {}

    async transform(dto: Record<string, any>): Promise<Record<string, any>> {
        const { name } = dto;
        const duplicate = await this.subjectsRepository.findUniqueSubject({ name });
        if (duplicate) {
            throw new RpcException({ message: `Subject name ${name} already exist`, statusCode: HttpStatus.CONFLICT });
        }
        return dto;
    }
}