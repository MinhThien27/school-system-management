import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { CreateDepartmentDto } from "../dtos/create-department.dto";
import { UpdateDepartmentDto } from "../dtos/update-department.dto";
import { DepartmentsRepository } from "../repositories/departments.repository";
import { Department } from "../types/department-custom.type";

type CheckDuplicateDepartmentDto = CreateDepartmentDto | UpdateDepartmentDto;
type CheckDuplicateDepartmentPayload = { departmentId: string, dto: CheckDuplicateDepartmentDto };

@Injectable()
export class CheckDuplicateDepartmentPipe implements PipeTransform<CheckDuplicateDepartmentPayload, Promise<CheckDuplicateDepartmentPayload>> {

    constructor(
        private readonly departmentsRepository: DepartmentsRepository
    ) { }

    async transform(payload: CheckDuplicateDepartmentPayload): Promise<CheckDuplicateDepartmentPayload> {
        const { departmentId, dto } = payload;
        let department: Department;
        if (departmentId) {
            department = await this.departmentsRepository.findUniqueDepartment({ id: departmentId });
            if (!department) {
                throw new RpcException({ message: `Department id ${departmentId} not found`, statusCode: HttpStatus.NOT_FOUND });
            }
        }
        await this.checkDuplicateName(department, dto);
        await this.checkDuplicateHeadTeacher(department, dto);
        return payload;
    }

    private async checkDuplicateName(department: Department, dto: CheckDuplicateDepartmentDto): Promise<void> {
        let name = dto.name;
        if (department) {
            name = (name && name !== department.name) ? name : undefined;
        }
        if (!name) return;
        const duplicate = await this.departmentsRepository.findUniqueDepartment({ name });
        if (duplicate) {
            throw new RpcException({ message: `Department name ${name} already exist`, statusCode: HttpStatus.CONFLICT });
        }
    }

    private async checkDuplicateHeadTeacher(department: Department, dto: CheckDuplicateDepartmentDto): Promise<void> {
        let headTeacherId = dto.headTeacherId;
        if (department) {
            headTeacherId = (headTeacherId && headTeacherId !== department.headTeacherId) ? headTeacherId : undefined;
        }
        if (!headTeacherId) return;
        const duplicate = await this.departmentsRepository.findUniqueDepartment({ headTeacherId });
        if (duplicate) {
            throw new RpcException({ message: `Head teacher id ${headTeacherId} already has department`, statusCode: HttpStatus.CONFLICT });
        }
    }
}