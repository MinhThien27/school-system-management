import { Body, Controller, Delete, Get, Param, Patch, Post, Put, ValidationPipe } from "@nestjs/common";
import { LevelsService } from "./services/levels.service";
import { CreateLevelDto } from "./dtos/create-level.dto";
import { UpdateLevelDto } from "./dtos/update-level.dto";
import { Filtering, FilteringParams, Pagination, PaginationParams, Sorting, SortingParams } from "src/decorators";
import { CreateLevelSubjectDto } from "./dtos/create-level-subject.dto";
import { LevelSubjectsService } from "./services/level-subjects.service";
import { UpdateLevelSubjectDto } from "./dtos/update-level-subject.dto";
import { UpdateLevelSubjectsDto } from "./dtos/update-level-subjects.dto";

@Controller({ path: 'levels', version: '1' })
export class LevelsController {

    constructor(
        private readonly levelsService: LevelsService,
        private readonly levelSubjectsService: LevelSubjectsService
    ) {}

    @Get()
    getLevels(
        @PaginationParams() pagination: Pagination,
        @SortingParams(['levelNumber']) sorts?: Sorting[],
        @FilteringParams(['levelNumber']) filters?: Filtering[]
    ) {
        return this.levelsService.getLevels(pagination, sorts, filters);
    }

    @Post()
    createLevel(@Body(new ValidationPipe({ whitelist: true })) createLevelDto: CreateLevelDto) {
        return this.levelsService.createLevel(createLevelDto);
    }
    
    @Patch(':levelId')
    updateLevel(
        @Param('levelId') levelId: string,
        @Body(new ValidationPipe({ whitelist: true })) updateLevelDto: UpdateLevelDto
    ) {
        return this.levelsService.updateLevel(levelId, updateLevelDto);
    }

    @Delete(':levelId')
    deleteLevel(
        @Param('levelId') levelId: string
    ) {
        return this.levelsService.deleteLevel(levelId);
    }

    @Get(':levelId')
    getLevel(
        @Param('levelId') levelId: string
    ) {
        return this.levelsService.getLevel(levelId);
    }

    /* Subjects */
    @Get(':levelId/subjects')
    getLevelSubjects(
        @Param('levelId') levelId: string,
        @PaginationParams() pagination: Pagination,
        @SortingParams(['levelId', 'subjectId']) sorts?: Sorting[],
        @FilteringParams(['levelId', 'subjectId']) filters?: Filtering[]
    ) {
        return this.levelSubjectsService.getLevelSubjects(levelId, pagination, sorts, filters);
    }

    @Post(':levelId/subjects')
    createLevelSubject(
        @Param('levelId') levelId: string,
        @Body(new ValidationPipe({ whitelist: true })) createLevelSubjectDto: CreateLevelSubjectDto
    ) {
        return this.levelSubjectsService.createLevelSubject(levelId, createLevelSubjectDto);
    }

    @Put(':levelId/subjects')
    updateLevelSubjects(
        @Param('levelId') levelId: string,
        @Body(new ValidationPipe({ whitelist: true })) updateLevelSubjectsDto: UpdateLevelSubjectsDto
    ) {
        return this.levelSubjectsService.updateLevelSubjects(levelId, updateLevelSubjectsDto);
    }

    @Patch(':levelId/subjects/:levelSubjectId')
    updateLevelSubject(
        @Param('levelId') levelId: string,
        @Param('levelSubjectId') levelSubjectId: string,
        @Body(new ValidationPipe({ whitelist: true })) updateLevelSubjectDto: UpdateLevelSubjectDto
    ) {
        return this.levelSubjectsService.updateLevelSubject(levelId, levelSubjectId, updateLevelSubjectDto);
    }

    @Delete(':levelId/subjects/:levelSubjectId')
    deleteLevelSubject(
        @Param('levelId') levelId: string,
        @Param('levelSubjectId') levelSubjectId: string
    ) {
        return this.levelSubjectsService.deleteLevelSubject(levelId, levelSubjectId);
    }

    @Get(':levelId/subjects/:levelSubjectId')
    getLevelSubject(
        @Param('levelId') levelId: string,
        @Param('levelSubjectId') levelSubjectId: string
    ) {
        return this.levelSubjectsService.getLevelSubject(levelId, levelSubjectId);
    }
}