import { HttpStatus, Inject, Injectable, PipeTransform } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { CreateDepartmentTeacherDto } from "../dtos/create-department-teacher.dto";
import { UpdateDepartmentTeacherDto } from "../dtos/update-department-teacher.dto";
import { TeachersRepository } from "src/teachers/repositories/teachers.repository";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";

type CheckDepartmentTeacherPropsExistenceDto = CreateDepartmentTeacherDto | UpdateDepartmentTeacherDto;
type CheckDepartmentTeacherPropsExistencePayload = { departmentId: string, dto: CheckDepartmentTeacherPropsExistenceDto };

@Injectable()
export class CheckDepartmentTeacherPropsExistencePipe implements PipeTransform<CheckDepartmentTeacherPropsExistencePayload, Promise<CheckDepartmentTeacherPropsExistencePayload>> {

    constructor(
        private readonly teachersRepository: TeachersRepository,
        @Inject('SUBJECT_SERVICE') private readonly subjectServiceClient: ClientProxy
    ) {}

    async transform(payload: CheckDepartmentTeacherPropsExistencePayload): Promise<CheckDepartmentTeacherPropsExistencePayload> {
        const { dto } = payload;
        await this.checkTeacherExistence(dto);
        await this.checkSubjectsExistence(dto);
        return payload;
    }

    private async checkTeacherExistence(dto: CheckDepartmentTeacherPropsExistenceDto): Promise<void> {
        const { teacherId } = dto;
        if (!teacherId) return;
        const teacher = await this.teachersRepository.findUniqueTeacher({ id: teacherId });
        if (!teacher) {
            throw new RpcException({ message: `Teacher id ${teacherId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
    }

    private async checkSubjectsExistence(dto: CheckDepartmentTeacherPropsExistenceDto): Promise<void> {
        const { subjectIds } = dto;
        if (!subjectIds) return;
        const ids = (await(firstValueFrom(this.subjectServiceClient.send(
            { cmd: 'get-subjects-with-subject-ids' }, 
            subjectIds
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        }))))).map((subject: any) => subject.id);
        let isExist = true;
        for (const subjectId of subjectIds) {
            if (!ids.includes(subjectId)) {
                isExist = false;
                break;
            }
        }
        if (!isExist) {
            throw new RpcException({ message: 'One of the subject ids does not exist', statusCode: HttpStatus.NOT_FOUND });
        }
    }
}