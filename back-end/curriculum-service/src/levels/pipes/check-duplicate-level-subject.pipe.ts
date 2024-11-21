import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { CreateLevelSubjectDto } from "../dtos/create-level-subject.dto";
import { UpdateLevelSubjectDto } from "../dtos/update-level-subject.dto";
import { LevelSubjectsRepository } from "../repositories/level-subjects.repository";
import { LevelSubject } from "../types/level-subject-custom.type";

type CheckDuplicateLevelSubjectDto = CreateLevelSubjectDto | UpdateLevelSubjectDto;
type CheckDuplicateLevelSubjectPayload = { levelId: string, levelSubjectId?: string, dto: CheckDuplicateLevelSubjectDto };

@Injectable()
export class CheckDuplicateLevelSubjectPipe implements PipeTransform<CheckDuplicateLevelSubjectPayload, Promise<CheckDuplicateLevelSubjectPayload>> {

    constructor(
        private readonly levelSubjectsRepository: LevelSubjectsRepository
    ) {}

    async transform(payload: CheckDuplicateLevelSubjectPayload): Promise<CheckDuplicateLevelSubjectPayload> {
        const { levelId, levelSubjectId, dto } = payload;
        let levelSubject: LevelSubject;
        if (levelSubjectId) {
            levelSubject = await this.levelSubjectsRepository.findUniqueLevelSubject({ id: levelSubjectId });
            if (!levelSubject) {
                throw new RpcException({ message: `Level subject id ${levelSubjectId} not found`, statusCode: HttpStatus.NOT_FOUND });
            }
        }
        await this.checkDuplicateSubjectInLevel(levelId, levelSubject, dto);
        return payload;
    }

    private async checkDuplicateSubjectInLevel(levelId: string, levelSubject: LevelSubject, dto: CheckDuplicateLevelSubjectDto): Promise<void> {
        let subjectId = dto.subjectId;
        let semesterNumber = dto.semesterNumber;
        if (levelSubject) {
            subjectId = (subjectId && subjectId !== levelSubject.subjectId) ? subjectId : undefined;
            semesterNumber = (semesterNumber && semesterNumber !== levelSubject.semesterNumber) ? semesterNumber : undefined;
            if (subjectId && !semesterNumber) semesterNumber = levelSubject.semesterNumber;
            if (!subjectId && semesterNumber) subjectId = levelSubject.subjectId;
        }
        if (!subjectId && !semesterNumber) return;
        const duplicate = await this.levelSubjectsRepository.findUniqueLevelSubject({
            levelId_semesterNumber_subjectId: {
                levelId, 
                semesterNumber,
                subjectId
            }
        });
        if (duplicate) {
            throw new RpcException({ message: `Subject id ${subjectId} already exist in semester number ${semesterNumber} for level id ${levelId}`, statusCode: HttpStatus.CONFLICT });
        }
    }
}