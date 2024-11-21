import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { DepartmentSubject } from "../types/department-subject-custom.type";
import { DepartmentSubjectsRepository } from "../repositories/department-subjects.repository";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class ParseDepartmentSubjectPipe implements PipeTransform<string, Promise<DepartmentSubject>> {

    constructor(private readonly departmentSubjectsRepository: DepartmentSubjectsRepository) {}

    async transform(departmentSubjectId: string): Promise<DepartmentSubject> {
        const departmentSubject = await this.departmentSubjectsRepository.findUniqueDepartmentSubject({ id: departmentSubjectId });
        if (!departmentSubject) {
            throw new RpcException({ message: `Department subject id ${departmentSubjectId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }   
        return departmentSubject;
    }
}