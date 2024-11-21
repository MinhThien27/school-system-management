import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { DepartmentSubjectsRepository } from "../repositories/department-subjects.repository";

type CheckDuplicateDepartmentSubjectDto = { subjectId?: string, subjectIds?: string };
type CheckDuplicateDepartmentSubjectPayload = { departmentId: string, departmentSubjectId?: string, dto: CheckDuplicateDepartmentSubjectDto };

@Injectable()
export class CheckDuplicateDepartmentSubjectPipe implements PipeTransform<CheckDuplicateDepartmentSubjectPayload, Promise<CheckDuplicateDepartmentSubjectPayload>> {

    constructor(
        private readonly departmentSubjectsRepository: DepartmentSubjectsRepository
    ) {}

    async transform(payload: CheckDuplicateDepartmentSubjectPayload): Promise<CheckDuplicateDepartmentSubjectPayload> {
        const { departmentId, departmentSubjectId, dto } = payload;
        if (dto.subjectIds) {
            return payload;
        } else {
            await this.checkDuplicateSubjectInDepartment(departmentId, departmentSubjectId, dto);
        }
        return payload;
    }

    private async checkDuplicateSubjectInDepartment(departmentId: string, departmentSubjectId: string, dto: CheckDuplicateDepartmentSubjectDto): Promise<void> {
        let subjectId = dto.subjectId;
        if (departmentSubjectId) {
            const departmentSubject = await this.departmentSubjectsRepository.findUniqueDepartmentSubject({ id: departmentSubjectId });
            if (!departmentSubject) {
                throw new RpcException({ message: `Department subject id ${departmentSubjectId} not found`, statusCode: HttpStatus.NOT_FOUND });
            }
            subjectId = (subjectId && subjectId !== departmentSubject.subjectId) ? subjectId : undefined;
        }
        if (!subjectId) return;
        const duplicate = await this.departmentSubjectsRepository.findUniqueDepartmentSubject({
            departmentId_subjectId: {
                departmentId,
                subjectId
            }
        });
        if (duplicate) {
            throw new RpcException({ message: `Subject id ${subjectId} already exist in department id ${departmentId}`, statusCode: HttpStatus.CONFLICT });
        }
    }
}