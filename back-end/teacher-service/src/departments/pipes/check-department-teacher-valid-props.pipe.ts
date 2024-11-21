import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { CreateDepartmentTeacherDto } from "../dtos/create-department-teacher.dto";
import { UpdateDepartmentTeacherDto } from "../dtos/update-department-teacher.dto";
import { DepartmentSubjectsRepository } from "../repositories/department-subjects.repository";

type CheckDepartmentTeacherValidPropsDto = CreateDepartmentTeacherDto | UpdateDepartmentTeacherDto;
type CheckDepartmentTeacherValidPropsPayload = { departmentId: string, dto: CheckDepartmentTeacherValidPropsDto };

@Injectable()
export class CheckDepartmentTeacherValidPropsPipe implements PipeTransform<CheckDepartmentTeacherValidPropsPayload, Promise<CheckDepartmentTeacherValidPropsPayload>> {

    constructor(
        private readonly departmentSubjectsRespository: DepartmentSubjectsRepository
    ) { }

    async transform(payload: CheckDepartmentTeacherValidPropsPayload): Promise<CheckDepartmentTeacherValidPropsPayload> {
        const { departmentId, dto } = payload;
        const { subjectIds } = dto;
        await this.checkSubjectIdsExistInDepartmentSubjects(departmentId, subjectIds);
        return payload;
    }

    private async checkSubjectIdsExistInDepartmentSubjects(departmentId: string, subjectIds: string[]): Promise<void> {
        if (!subjectIds) return;
        const ids = (await this.departmentSubjectsRespository.findDepartmentSubjectsWithSubjectIds(subjectIds)).map(departmentSubject => departmentSubject.subjectId);
        let isExist = true;
        for (const subjectId of subjectIds) {
            if (!ids.includes(subjectId)) {
                isExist = false;
                break;
            }
        }
        if (!isExist) {
            throw new RpcException({ message: `One of the subject ids does not exist in department id ${departmentId}`, statusCode: HttpStatus.NOT_FOUND });
        }
    }
}