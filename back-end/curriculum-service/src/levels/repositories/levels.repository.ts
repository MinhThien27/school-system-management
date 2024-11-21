import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/services/database.service";
import { CreateLevelDto } from "../dtos/create-level.dto";
import { Level, levelSelect } from "../types/level-custom.type";
import { Prisma } from "@prisma/client";
import { UpdateLevelDto } from "../dtos/update-level.dto";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { getOrder, getWhere } from "src/helpers";

@Injectable()
export class LevelsRepository {

    constructor(private readonly databaseService: DatabaseService) {}

    async countLevels(): Promise<number> {
        const levelCount = await this.databaseService.level.count();
        return levelCount;
    }

    async findLevels(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<Level[]> {
        const levels = await this.databaseService.level.findMany(({
            skip: pagination.offset,
            take: pagination.limit,
            where: getWhere(filters),
            orderBy: getOrder(sorts),
            select: levelSelect
        }));
        return levels;
    }

    async findUniqueLevel(filterQuery: Prisma.LevelWhereUniqueInput): Promise<Level> {
        const level = await this.databaseService.level.findUnique({
            where: filterQuery,
            select: levelSelect
        });
        return level;
    }

    async createLevel(createLevelDto: CreateLevelDto): Promise<Level> {
        const createdLevel = await this.databaseService.level.create({
            data: createLevelDto,
            select: levelSelect
        });
        return createdLevel;
    }
    
    async updateLevel(id: string, updateLevelDto: UpdateLevelDto): Promise<Level> {
        const updatedLevel = await this.databaseService.level.update({
            where: { id },
            data: updateLevelDto,
            select: levelSelect
        });
        return updatedLevel;
    }

    async deleteLevel(id: string): Promise<Level> {
        const deletedLevel = await this.databaseService.level.delete({
            where: { id },
            select: levelSelect
        });
        return deletedLevel;
    }
}