import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { DepartmentsRepository } from "../repositories/departments.repository";
import { Department } from "../types/department-custom.type";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class ParseDepartmentPipe implements PipeTransform<string, Promise<Department>> {

    constructor(private readonly departmentsRepository: DepartmentsRepository) {}

    async transform(departmentId: string): Promise<Department> {
        const department = await this.departmentsRepository.findUniqueDepartment({ id: departmentId });
        if (!department) {
            throw new RpcException({ message: `Department id ${departmentId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }   
        return department;
    }
}