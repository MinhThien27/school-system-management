import { Inject, Injectable, PipeTransform } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";

type CheckDepartmentSubjectPropsExistenceDto = { subjectId?: string, subjectIds?: string[] };
type CheckDepartmentSubjectPropsExistencePayload = { departmentId: string, dto: CheckDepartmentSubjectPropsExistenceDto };

@Injectable()
export class CheckDepartmentSubjectPropsExistencePipe implements PipeTransform<CheckDepartmentSubjectPropsExistencePayload, Promise<CheckDepartmentSubjectPropsExistencePayload>> {

    constructor(
        @Inject('SUBJECT_SERVICE') private readonly subjectServiceClient: ClientProxy
    ) {}

    async transform(payload: CheckDepartmentSubjectPropsExistencePayload): Promise<CheckDepartmentSubjectPropsExistencePayload> {
        const { dto } = payload;
        if (dto.subjectIds) {
            await this.checkSubjectsExistence(dto);
        } else {
            await this.checkSubjectExistence(dto);
        }
        return payload;
    }

    private async checkSubjectExistence(dto: CheckDepartmentSubjectPropsExistenceDto): Promise<void> {
        const { subjectId } = dto;
        if (!subjectId) return;
        await(firstValueFrom(this.subjectServiceClient.send(
            { cmd: 'get-subject' }, 
            subjectId
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        }))));
    }

    private async checkSubjectsExistence(dto: CheckDepartmentSubjectPropsExistenceDto): Promise<void> {
        const { subjectIds } = dto;
        for (const subjectId of subjectIds) {
            await this.checkSubjectExistence({ subjectId });
        }
    }
}