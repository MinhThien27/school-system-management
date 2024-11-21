import { Inject, Injectable, PipeTransform } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { CreateLevelSubjectDto } from "../dtos/create-level-subject.dto";
import { UpdateLevelSubjectDto } from "../dtos/update-level-subject.dto";

type CheckLevelSubjectPropsExistenceDto = CreateLevelSubjectDto | UpdateLevelSubjectDto;
type CheckLevelSubjectPropsExistencePayload = { levelId: string, dto: CheckLevelSubjectPropsExistenceDto };

@Injectable()
export class CheckLevelSubjectPropsExistencePipe implements PipeTransform<CheckLevelSubjectPropsExistencePayload, Promise<CheckLevelSubjectPropsExistencePayload>> {

    constructor(
        @Inject('SUBJECT_SERVICE') private readonly subjectServiceClient: ClientProxy
    ) {}

    async transform(payload: CheckLevelSubjectPropsExistencePayload): Promise<CheckLevelSubjectPropsExistencePayload> {
        const { dto } = payload;
        if ((dto as any).levelSubjectDtos) {
            await this.checkSubjectsExistence(dto);
        } else {
            await this.checkSubjectExistence(dto);
        }
        return payload;
    }

    private async checkSubjectExistence(dto: CheckLevelSubjectPropsExistenceDto): Promise<void> {
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

    private async checkSubjectsExistence(dto: CheckLevelSubjectPropsExistenceDto): Promise<void> {
        const { levelSubjectDtos } = dto as any;
        for (const levelSubjectDto of levelSubjectDtos) {
            await this.checkSubjectExistence({ subjectId: levelSubjectDto.subjectId });
        }
    }
}