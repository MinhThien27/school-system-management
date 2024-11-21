import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { CreateDepartmentDto } from "../dtos/create-department.dto";
import { UpdateDepartmentDto } from "../dtos/update-department.dto";
import { TeachersRepository } from "src/teachers/repositories/teachers.repository";

type CheckDepartmentPropsExistenceDto = CreateDepartmentDto | UpdateDepartmentDto;
type CheckDepartmentPropsExistencePayload = { departmentId: string, dto: CheckDepartmentPropsExistenceDto };

@Injectable()
export class CheckDepartmentPropsExistencePipe implements PipeTransform<CheckDepartmentPropsExistencePayload, Promise<CheckDepartmentPropsExistencePayload>> {

    constructor(
        private readonly teachersRepository: TeachersRepository
    ) { }

    async transform(payload: CheckDepartmentPropsExistencePayload): Promise<CheckDepartmentPropsExistencePayload> {
        const { dto } = payload;
        await this.checkHeadTeacherExistence(dto);
        return payload;
    }

    private async checkHeadTeacherExistence(dto: CheckDepartmentPropsExistenceDto): Promise<void> {
        const headTeacherId = dto.headTeacherId;
        if (!headTeacherId) return;
        const headTeacher = await this.teachersRepository.findUniqueTeacher({ id: headTeacherId });
        if (!headTeacher) {
            throw new RpcException({ message: `Head teacher id ${headTeacherId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
    }
}