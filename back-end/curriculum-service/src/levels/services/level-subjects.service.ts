import { Injectable } from "@nestjs/common";
import { CreateLevelSubjectDto } from "../dtos/create-level-subject.dto";
import { LevelSubject, LevelSubjectWithDetail } from "../types/level-subject-custom.type";
import { LevelSubjectsRepository } from "../repositories/level-subjects.repository";
import { UpdateLevelSubjectDto } from "../dtos/update-level-subject.dto";
import { Filtering, PaginatedResource, Pagination, Sorting } from "src/interfaces";
import { Prisma } from "@prisma/client";
import { UpdateLevelSubjectsDto } from "../dtos/update-level-subjects.dto";
import { LevelSubjectsFacade } from "../facades/level-subjects.facade";

@Injectable()
export class LevelSubjectsService {

    constructor(
        private readonly levelSubjectsRepository: LevelSubjectsRepository,
        private readonly levelSubjectsFacade: LevelSubjectsFacade
    ) {}

    async getLevelSubjects(
        levelId: string, 
        pagination: Pagination, 
        sorts?: Sorting[], filters?: Filtering[]
    ): Promise<PaginatedResource<LevelSubjectWithDetail>> {
        const levelSubjects = await this.levelSubjectsRepository.findLevelSubjects(levelId, pagination, sorts, filters);
        const levelSubjectsWithDetail = await this.levelSubjectsFacade.getLevelSubjectsWithDetail(levelSubjects);
        const levelSubjectCount = await this.levelSubjectsRepository.countLevelSubjects({ levelId });
        return {
            totalItems: levelSubjectCount,
            items: levelSubjectsWithDetail,
            page: pagination.page,
            size: pagination.size
        };
    }

    async getLevelSubjectsWithFilterQuery(filterQuery: Prisma.LevelSubjectWhereInput): Promise<LevelSubjectWithDetail[]> {
        return this.levelSubjectsFacade.getLevelSubjectsWithDetail(
            await this.levelSubjectsRepository.findLevelSubjectsWithFilterQuery(filterQuery)
        );
    }

    async createLevelSubject(
        levelId: string, 
        createLevelSubjectDto: CreateLevelSubjectDto
    ): Promise<LevelSubjectWithDetail> {
        return this.levelSubjectsFacade.getLevelSubjectWithDetail(
            await this.levelSubjectsRepository.createLevelSubject(levelId, createLevelSubjectDto)
        );
    }

    async updateLevelSubject(
        levelSubjectId: string, 
        updateLevelSubjectDto: UpdateLevelSubjectDto
    ): Promise<LevelSubjectWithDetail> {
        return this.levelSubjectsFacade.getLevelSubjectWithDetail(
            await this.levelSubjectsRepository.updateLevelSubject(levelSubjectId, updateLevelSubjectDto)
        );
    }

    udpateDepartmentSubjects(levelId: string, updateLevelSubjectsDto: UpdateLevelSubjectsDto): Promise<Prisma.BatchPayload> {
        return this.levelSubjectsRepository.updateLevelSubjects(levelId, updateLevelSubjectsDto);
    }
    
    deleteLevelSubject(levelSubjectId: string): Promise<LevelSubject> {
        return this.levelSubjectsRepository.deleteLevelSubject(levelSubjectId);
    }

    async getLevelSubject(
        levelSubject: LevelSubject
    ): Promise<LevelSubjectWithDetail> {
        return this.levelSubjectsFacade.getLevelSubjectWithDetail(levelSubject);
    }

    deleteLevelSubjects(filterQuery: Prisma.LevelSubjectWhereInput): Promise<Prisma.BatchPayload> {
        return this.levelSubjectsRepository.deleteLevelSubjects(filterQuery);
    }
}