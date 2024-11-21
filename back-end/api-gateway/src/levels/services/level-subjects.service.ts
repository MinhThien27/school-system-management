import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateLevelSubjectDto } from "../dtos/create-level-subject.dto";
import { throwError, timeout } from "rxjs";
import { UpdateLevelSubjectDto } from "../dtos/update-level-subject.dto";
import { Filtering, Pagination, Sorting } from "src/decorators";
import { UpdateLevelSubjectsDto } from "../dtos/update-level-subjects.dto";

@Injectable()
export class LevelSubjectsService {

    constructor(@Inject('CURRICULUM_SERVICE') private readonly curriculumServiceClient: ClientProxy) {}

    getLevelSubjects(levelId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]) {
        return this.curriculumServiceClient.send({ cmd: 'get-level-subjects' }, { levelId, pagination, sorts, filters })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
    
    createLevelSubject(levelId: string, createLevelSubjectDto: CreateLevelSubjectDto) {
        return this.curriculumServiceClient.send({ cmd: 'create-level-subject' }, { levelId, dto: createLevelSubjectDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    updateLevelSubject(levelId: string, levelSubjectId: string, updateLevelSubjectDto: UpdateLevelSubjectDto) {
        return this.curriculumServiceClient.send({ cmd: 'update-level-subject' }, { levelId, levelSubjectId, dto: updateLevelSubjectDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    updateLevelSubjects(levelId: string, updateLevelSubjectsDto: UpdateLevelSubjectsDto) {
        return this.curriculumServiceClient.send({ cmd: 'update-level-subjects' }, { levelId, dto: updateLevelSubjectsDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    deleteLevelSubject(levelId: string, levelSubjectId: string) {
        return this.curriculumServiceClient.send({ cmd: 'delete-level-subject' }, { levelId, levelSubjectId })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
    
    getLevelSubject(levelId: string, levelSubjectId: string) {
        return this.curriculumServiceClient.send({ cmd: 'get-level-subject' }, { levelId, levelSubjectId })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}