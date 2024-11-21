import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/services/database.service";
import { CreateLevelSubjectDto } from "../dtos/create-level-subject.dto";
import { LevelSubject, levelSubjectSelect } from "../types/level-subject-custom.type";
import { Prisma } from "@prisma/client";
import { UpdateLevelSubjectDto } from "../dtos/update-level-subject.dto";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { getOrder, getWhere } from "src/helpers";
import { UpdateLevelSubjectsDto } from "../dtos/update-level-subjects.dto";

@Injectable()
export class LevelSubjectsRepository {

    constructor(private readonly databaseService: DatabaseService) {}

    async countLevelSubjects(filterQuery: Prisma.LevelSubjectWhereInput): Promise<number> {
        const levelSubjectCount = await this.databaseService.levelSubject.count({
            where: filterQuery
        });
        return levelSubjectCount;
    }

    async findLevelSubjects(levelId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<LevelSubject[]> {
        const levelSubjects = await this.databaseService.levelSubject.findMany(({
            skip: pagination.offset,
            take: pagination.limit,
            where: { levelId, ...getWhere(filters) },
            orderBy: getOrder(sorts),
            select: levelSubjectSelect
        }));
        return levelSubjects;
    }

    async findLevelSubjectsWithFilterQuery(filterQuery: Prisma.LevelSubjectWhereInput): Promise<LevelSubject[]> {
        const levelSubjects = await this.databaseService.levelSubject.findMany(({
            where: filterQuery,
            select: levelSubjectSelect
        }));
        return levelSubjects;
    }

    async findUniqueLevelSubject(filterQuery: Prisma.LevelSubjectWhereUniqueInput): Promise<LevelSubject> {
        const levelSubject = await this.databaseService.levelSubject.findUnique({
            where: filterQuery,
            select: levelSubjectSelect
        });
        return levelSubject;
    }

    async createLevelSubject(levelId: string, createLevelSubjectDto: CreateLevelSubjectDto): Promise<LevelSubject> {
        const createdLevelSubject = await this.databaseService.levelSubject.create({
            data: { levelId, ...createLevelSubjectDto },
            select: levelSubjectSelect
        });
        return createdLevelSubject;
    }

    async updateLevelSubject(id: string, updateLevelSubjectDto: UpdateLevelSubjectDto): Promise<LevelSubject> {
        const updatedLevelSubject = await this.databaseService.levelSubject.update({
            where: { id },
            data: updateLevelSubjectDto,
            select: levelSubjectSelect
        });
        return updatedLevelSubject;
    }

    async updateLevelSubjects(levelId: string, { levelSubjectDtos }: UpdateLevelSubjectsDto): Promise<Prisma.BatchPayload> {
        if (!levelSubjectDtos) return { count: 0 };
        const result = await this.databaseService.$transaction([
            this.databaseService.levelSubject.deleteMany({
                where: { levelId }
            }),
            this.databaseService.levelSubject.createMany({
                data: levelSubjectDtos.map(levelSubjectDto => ({ 
                    levelId, semesterNumber: 
                    levelSubjectDto.semesterNumber, 
                    subjectId: levelSubjectDto.subjectId 
                })),
                skipDuplicates: true
            })
        ], {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable
        });
        return result[1];
    }

    async deleteLevelSubject(id: string): Promise<LevelSubject> {
        const deletedLevelSubject = await this.databaseService.levelSubject.delete({
            where: { id },
            select: levelSubjectSelect
        });
        return deletedLevelSubject;
    }

    async deleteLevelSubjects(filterQuery: Prisma.LevelSubjectWhereInput): Promise<Prisma.BatchPayload> {
        return await this.databaseService.levelSubject.deleteMany({
            where: filterQuery
        });
    }
}