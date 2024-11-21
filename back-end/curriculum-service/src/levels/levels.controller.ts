import { Controller, UseFilters } from "@nestjs/common";
import { AllExceptionsFilter } from "src/exception-filters";
import { LevelsService } from "./services/levels.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateLevelDto } from "./dtos/create-level.dto";
import { CheckDuplicateLevelPipe } from "./pipes/check-duplicate-level.pipe";
import { UpdateLevelDto } from "./dtos/update-level.dto";
import { ParseLevelPipe } from "./pipes/parse-level.pipe";
import { Level } from "./types/level-custom.type";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { CreateLevelSubjectDto } from "./dtos/create-level-subject.dto";
import { LevelSubjectsService } from "./services/level-subjects.service";
import { ParseLevelSubjectPipe } from "./pipes/parse-level-subject.pipe";
import { LevelSubject } from "./types/level-subject-custom.type";
import { UpdateLevelSubjectDto } from "./dtos/update-level-subject.dto";
import { CheckLevelSubjectPropsExistencePipe } from "./pipes/check-level-subject-props-existence.pipe";
import { CheckDuplicateLevelSubjectPipe } from "./pipes/check-duplicate-level-subject.pipe";
import { CheckLevelSubjectValidPropsPipe } from "./pipes/check-level-subject-valid-props.pipe";
import { Prisma } from "@prisma/client";
import { UpdateLevelSubjectsDto } from "./dtos/update-level-subjects.dto";

@Controller()
@UseFilters(AllExceptionsFilter)
export class LevelsController {

    constructor(
        private readonly levelsService: LevelsService,
        private readonly levelSubjectsService: LevelSubjectsService
    ) {}

    @MessagePattern({ cmd: 'get-levels' })
    getLevels(
        @Payload('pagination') pagination: Pagination,
        @Payload('sorts') sorts?: Sorting[],
        @Payload('filters') filters?: Filtering[]
    ) {
        return this.levelsService.getLevels(pagination, sorts, filters);
    }

    @MessagePattern({ cmd: 'create-level' })
    createLevel(
        @Payload(CheckDuplicateLevelPipe) payload: any,
        @Payload('dto') createLevelDto: CreateLevelDto
    ) {
        return this.levelsService.createLevel(createLevelDto);
    }
    
    @MessagePattern({ cmd: 'update-level' })
    updateLevel(
        @Payload(CheckDuplicateLevelPipe) payload: any,
        @Payload('levelId') levelId: string,
        @Payload('dto') updateLevelDto: UpdateLevelDto
    ) {
        return this.levelsService.updateLevel(levelId, updateLevelDto);
    }

    @MessagePattern({ cmd: 'delete-level' })
    deleteLevel(
        @Payload(ParseLevelPipe) level: Level
    ) {
        return this.levelsService.deleteLevel(level.id);
    }

    @MessagePattern({ cmd: 'get-level' })
    getLevel(
        @Payload(ParseLevelPipe) level: Level
    ) {
        return level;
    }

    /* Subjects */
    @MessagePattern({ cmd: 'get-level-subjects' })
    getLevelSubjects(
        @Payload('levelId', ParseLevelPipe) level: Level,
        @Payload('pagination') pagination: Pagination,
        @Payload('sorts') sorts?: Sorting[],
        @Payload('filters') filters?: Filtering[]
    ) {
        return this.levelSubjectsService.getLevelSubjects(level.id, pagination, sorts, filters);
    }

    @MessagePattern({ cmd: 'get-level-subjects-with-filter-query' })
    getLevelSubjectsWithFilterQuery(
        @Payload('filterQuery') filterQuery: Prisma.LevelSubjectWhereInput
    ) {
        console.log({ filterQuery })
        return this.levelSubjectsService.getLevelSubjectsWithFilterQuery(filterQuery);
    }

    @MessagePattern({ cmd: 'create-level-subject' })
    createLevelSubject(
        @Payload(
            CheckLevelSubjectPropsExistencePipe,
            CheckLevelSubjectValidPropsPipe,
            CheckDuplicateLevelSubjectPipe
        ) payload: any,
        @Payload('levelId', ParseLevelPipe) level: Level,
        @Payload('dto') createLevelSubjectDto: CreateLevelSubjectDto
    ) {
        return this.levelSubjectsService.createLevelSubject(level.id, createLevelSubjectDto);
    }

    @MessagePattern({ cmd: 'update-level-subject' })
    updateLevelSubject(
        @Payload(
            CheckLevelSubjectPropsExistencePipe,
            CheckLevelSubjectValidPropsPipe,
            CheckDuplicateLevelSubjectPipe
        ) payload: any,
        @Payload('levelId', ParseLevelPipe) level: Level,
        @Payload('levelSubjectId', ParseLevelSubjectPipe) levelSubject: LevelSubject,
        @Payload('dto') updateLevelSubjectDto: UpdateLevelSubjectDto
    ) {
        return this.levelSubjectsService.updateLevelSubject(levelSubject.id, updateLevelSubjectDto);
    }

    @MessagePattern({ cmd: 'update-level-subjects' })
    updateLevelSubjects(
        @Payload(
            CheckLevelSubjectPropsExistencePipe,
            CheckLevelSubjectValidPropsPipe
        ) payload: any,
        @Payload('levelId', ParseLevelPipe) level: Level,
        @Payload('dto') updateLevelSubjectsDto: UpdateLevelSubjectsDto 
    ) { 
        return this.levelSubjectsService.udpateDepartmentSubjects(level.id, updateLevelSubjectsDto);
    }

    @MessagePattern({ cmd: 'delete-level-subject' })
    deleteLevelSubject(
        @Payload('levelId', ParseLevelPipe) level: Level,
        @Payload('levelSubjectId', ParseLevelSubjectPipe) levelSubject: LevelSubject
    ) {
        return this.levelSubjectsService.deleteLevelSubject(levelSubject.id);
    }

    @MessagePattern({ cmd: 'get-level-subject' })
    getLevelSubject(
        @Payload('levelId', ParseLevelPipe) level: Level,
        @Payload('levelSubjectId', ParseLevelSubjectPipe) levelSubject: LevelSubject
    ) {
        return this.levelSubjectsService.getLevelSubject(levelSubject);
    }

    @MessagePattern({ cmd: 'delete-level-subjects' })
    deleteLevelSubjects(
        @Payload('filterQuery') filterQuery: Prisma.LevelSubjectWhereInput
    ) {
        return this.levelSubjectsService.deleteLevelSubjects(filterQuery);
    }
}