import { HttpStatus, Inject, Injectable, PipeTransform } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { CreateLevelSubjectDto } from "../dtos/create-level-subject.dto";
import { UpdateLevelSubjectDto } from "../dtos/update-level-subject.dto";
import { LevelSubject } from "../types/level-subject-custom.type";
import { LevelSubjectsRepository } from "../repositories/level-subjects.repository";

type CheckLevelSubjectValidPropsDto = CreateLevelSubjectDto | UpdateLevelSubjectDto;
type CheckLevelSubjectValidPropsPayload = { levelId: string, levelSubjectId?: string, dto: CheckLevelSubjectValidPropsDto };

@Injectable()
export class CheckLevelSubjectValidPropsPipe implements PipeTransform<CheckLevelSubjectValidPropsPayload, Promise<CheckLevelSubjectValidPropsPayload>> {

    constructor(
        private readonly levelSubjectsRepository: LevelSubjectsRepository,
        @Inject('CONFIGURATION_SERVICE') private readonly configurationServiceClient: ClientProxy
    ) { }

    async transform(payload: CheckLevelSubjectValidPropsPayload): Promise<CheckLevelSubjectValidPropsPayload> {
        const { levelSubjectId, dto } = payload;
        let levelSubject: LevelSubject;
        if (levelSubjectId) {
            levelSubject = await this.levelSubjectsRepository.findUniqueLevelSubject({ id: levelSubjectId });
            if (!levelSubject) {
                throw new RpcException({ message: `Level subject id ${levelSubjectId} not found`, statusCode: HttpStatus.NOT_FOUND });
            }
        }
        if ((dto as any).levelSubjectDtos) {
            await this.checkLevelSubjectsValiSemesterNumber(levelSubject, dto);
        } else {
            await this.checkLevelSubjectValiSemesterNumber(levelSubject, dto);
        }
        return payload;
    }

    private async checkLevelSubjectValiSemesterNumber(levelSubject: LevelSubject, dto: CheckLevelSubjectValidPropsDto): Promise<void> {
        let semesterNumber = dto.semesterNumber;
        if (levelSubject) {
            semesterNumber = (semesterNumber && semesterNumber !== levelSubject.semesterNumber) ? semesterNumber : undefined;
        }
        if (!semesterNumber) return;
        const schoolConfiguration: Record<string, any> = await firstValueFrom(this.configurationServiceClient.send(
            { cmd: 'get-school-configuration' }, 
            {}
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        if (semesterNumber > schoolConfiguration.numberOfSemesters) {
            throw new RpcException({ message: 'Invalid semester number', statusCode: HttpStatus.BAD_REQUEST });
        }
    }

    private async checkLevelSubjectsValiSemesterNumber(levelSubject: LevelSubject, dto: CheckLevelSubjectValidPropsDto): Promise<void> {
        const { levelSubjectDtos } = dto as any;
        for (const levelSubjectDto of levelSubjectDtos) {
            await this.checkLevelSubjectValiSemesterNumber(levelSubject, { semesterNumber: levelSubjectDto.semesterNumber });
        }
    }
}