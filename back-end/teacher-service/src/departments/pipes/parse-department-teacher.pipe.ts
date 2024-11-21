import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { DepartmentTeacher } from "../types/department-teacher-custom.type";
import { DepartmentTeachersRepository } from "../repositories/department-teachers.repository";

@Injectable()
export class ParseDepartmentTeacherPipe implements PipeTransform<string, Promise<DepartmentTeacher>> {

    constructor(private readonly departmentTeachersRepository: DepartmentTeachersRepository) {}

    async transform(departmentTeacherId: string): Promise<DepartmentTeacher> {
        const departmentTeacher = await this.departmentTeachersRepository.findUniqueDepartmentTeacher({ id: departmentTeacherId });
        if (!departmentTeacher) {
            throw new RpcException({ message: `Department teacher id ${departmentTeacherId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }   
        return departmentTeacher;
    }
}