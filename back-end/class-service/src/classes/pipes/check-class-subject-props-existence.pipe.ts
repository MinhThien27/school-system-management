import { Inject, Injectable, PipeTransform } from "@nestjs/common";
import { CreateclassSubjectDto } from "../dtos/create-class-subject.dto";
import { UpdateClassSubjectDto } from "../dtos/update-class-subject.dto";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";

type CheckClassSubjectPropsExistenceDto = CreateclassSubjectDto | UpdateClassSubjectDto;
type CheckClassSubjectPropsExistencePayload = { classId: string, dto: CheckClassSubjectPropsExistenceDto };

@Injectable()
export class CheckClassSubjectPropsExistencePipe implements PipeTransform<CheckClassSubjectPropsExistencePayload, Promise<CheckClassSubjectPropsExistencePayload>> {

    constructor(
        @Inject('SUBJECT_SERVICE') private readonly subjectServiceClient: ClientProxy,
        @Inject('SEMESTER_SERVICE') private readonly semesterServiceClient: ClientProxy 
    ) {}

    async transform(payload: CheckClassSubjectPropsExistencePayload): Promise<CheckClassSubjectPropsExistencePayload> {
        const { dto } = payload;
        await this.checkSubjectExistence(dto);
        await this.checkSemesterExistence(dto);
        return payload;
    }

    private async checkSubjectExistence(dto: CheckClassSubjectPropsExistenceDto): Promise<void> {
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

    private async checkSemesterExistence(dto: CheckClassSubjectPropsExistenceDto): Promise<void> {
        const { semesterId } = dto;
        if (!semesterId) return;
        await firstValueFrom(this.semesterServiceClient.send(
            { cmd: 'get-semester-without-academic-year-id' },
            semesterId
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }
}