import { Inject, Injectable } from "@nestjs/common";
import { LevelsRepository } from "../repositories/levels.repository";
import { CreateLevelDto } from "../dtos/create-level.dto";
import { Level } from "../types/level-custom.type";
import { UpdateLevelDto } from "../dtos/update-level.dto";
import { Filtering, PaginatedResource, Pagination, Sorting } from "src/interfaces";
import { DeleteLevelSagaState } from "../sagas/delete-level/delete-level-saga-state";
import { DeleteLevelSaga } from "../sagas/delete-level/delete-level.saga";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class LevelsService {

    constructor(
        private readonly levelsRepository: LevelsRepository,
        @Inject('CURRICULUM_SERVICE') private readonly curriculumServiceClient: ClientProxy,
        @Inject('CLASS_SERVICE') private readonly classServiceClient: ClientProxy
    ) {} 
    
    async getLevels(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<PaginatedResource<Level>> {
        const levels = await this.levelsRepository.findLevels(pagination, sorts, filters);
        const levelCount = await this.levelsRepository.countLevels();
        return {
            totalItems: levelCount,
            items: levels,
            page: pagination.page,
            size: pagination.size
        };
    }

    createLevel(createLevelDto: CreateLevelDto): Promise<Level> {
        return this.levelsRepository.createLevel(createLevelDto);
    }

    updateLevel(levelId: string, updateLevelDto: UpdateLevelDto): Promise<Level> {
        return this.levelsRepository.updateLevel(levelId, updateLevelDto);
    }

    async deleteLevel(levelId: string): Promise<Level> {
        const deletedLevel = await this.levelsRepository.deleteLevel(levelId);
        const deleteLevelSagaState = new DeleteLevelSagaState(
            this.curriculumServiceClient,
            this.classServiceClient,
            deletedLevel
        );
        const deleteLevelSaga = new DeleteLevelSaga();
        await deleteLevelSaga.excute(deleteLevelSagaState);
        return deletedLevel;
    }
}