import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateLevelDto } from "../dtos/create-level.dto";
import { throwError, timeout } from "rxjs";
import { UpdateLevelDto } from "../dtos/update-level.dto";
import { Filtering, Pagination, Sorting } from "src/decorators";

@Injectable()
export class LevelsService {

    constructor(@Inject('CURRICULUM_SERVICE') private readonly curriculumServiceClient: ClientProxy) {}

    getLevels(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]) {
        return this.curriculumServiceClient.send({ cmd: 'get-levels' }, { pagination, sorts, filters })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    createLevel(createLevelDto: CreateLevelDto) {
        return this.curriculumServiceClient.send({ cmd: 'create-level' }, { dto: createLevelDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    updateLevel(levelId: string, updateLevelDto: UpdateLevelDto) {
        return this.curriculumServiceClient.send({ cmd: 'update-level' }, { levelId, dto: updateLevelDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    deleteLevel(levelId: string) {
        return this.curriculumServiceClient.send({ cmd: 'delete-level' }, levelId)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    getLevel(levelId: string) {
        return this.curriculumServiceClient.send({ cmd: 'get-level' }, levelId)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}