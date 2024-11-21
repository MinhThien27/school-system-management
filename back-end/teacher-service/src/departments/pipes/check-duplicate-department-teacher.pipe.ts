import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { CreateDepartmentTeacherDto } from "../dtos/create-department-teacher.dto";
import { UpdateDepartmentTeacherDto } from "../dtos/update-department-teacher.dto";
import { DepartmentTeachersRepository } from "../repositories/department-teachers.repository";

type CheckDuplicateDepartmentTeacherDto = CreateDepartmentTeacherDto | UpdateDepartmentTeacherDto;
type CheckDuplicateDepartmentTeacherPayload = { departmentId: string, departmentTeacherId?: string, dto: CheckDuplicateDepartmentTeacherDto };

@Injectable()
export class CheckDuplicateDepartmentTeacherPipe implements PipeTransform<CheckDuplicateDepartmentTeacherPayload, Promise<CheckDuplicateDepartmentTeacherPayload>> {

    constructor(
        private readonly departmentTeachersRepository: DepartmentTeachersRepository
    ) {}

    async transform(payload: CheckDuplicateDepartmentTeacherPayload): Promise<CheckDuplicateDepartmentTeacherPayload> {
        const { departmentId, departmentTeacherId, dto } = payload;
        await this.checkDuplicateTeacherInDepartment(departmentId, departmentTeacherId, dto);
        return payload;
    }

    private async checkDuplicateTeacherInDepartment(departmentId: string, departmentTeacherId: string, dto: CheckDuplicateDepartmentTeacherDto): Promise<void> {
        let teacherId = dto.teacherId;
        if (departmentTeacherId) {
            const departmentTeacher = await this.departmentTeachersRepository.findUniqueDepartmentTeacher({ id: departmentTeacherId });
            if (!departmentTeacher) {
                throw new RpcException({ message: `Department teacher id ${departmentTeacherId} not found`, statusCode: HttpStatus.NOT_FOUND });
            }
            teacherId = (teacherId && teacherId !== departmentTeacher.teacherId) ? teacherId : undefined;
        }
        if (!teacherId) return;
        const duplicate = await this.departmentTeachersRepository.findUniqueDepartmentTeacher({
            departmentId_teacherId: {
                departmentId,
                teacherId
            }
        });
        if (duplicate) {
            throw new RpcException({ message: `Teacher id ${teacherId} already exist in department id ${departmentId}`, statusCode: HttpStatus.CONFLICT });
        }
    }
}