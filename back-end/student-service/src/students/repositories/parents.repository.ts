import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DatabaseService } from "src/database/services/database.service";
import { Parent, parentSelect } from "../types/parent-custom.type";
import { CreateParentDto } from "../dtos/create-parent.dto";
import { UpdateParentDto } from "../dtos/update-parent.dto";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { getOrder, getWhere } from "src/helpers";

@Injectable()
export class ParentsRepository {

    constructor(private readonly databaseService: DatabaseService) { }
    
    async countParents(filterQuery: Prisma.ParentWhereInput): Promise<number> {
        const parentCount = await this.databaseService.parent.count({
            where: filterQuery
        });
        return parentCount;
    }

    async findParents(studentId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<Parent[]> {
        const parents = await this.databaseService.parent.findMany(({
            skip: pagination.offset,
            take: pagination.limit,
            where: { studentId, ...getWhere(filters) },
            orderBy: getOrder(sorts),
            select: parentSelect
        }));
        return parents;
    } 

    async findUniqueParent(filterQuery: Prisma.ParentWhereUniqueInput): Promise<Parent> {
        const parent = await this.databaseService.parent.findUnique({
            where: filterQuery,
            select: parentSelect
        });
        return parent;
    }

    async createParent(studentId: string, createParentDto: CreateParentDto): Promise<Parent> {
        const createdParent = await this.databaseService.parent.create({
            data: { ...createParentDto, dob: new Date(createParentDto.dob), studentId },
            select: parentSelect
        });
        return createdParent;
    }

    async updateParent(id: string, updateParentDto: UpdateParentDto): Promise<Parent> {
        const dob = updateParentDto.dob ? new Date(updateParentDto.dob) : undefined;
        const updatedParent = await this.databaseService.parent.update({
            where: { id },
            data: { ...updateParentDto, dob },
            select: parentSelect
        });
        return updatedParent;
    }

    async deleteParent(id: string): Promise<Parent> {
        const deletedParent = await this.databaseService.parent.delete({
            where: { id },
            select: parentSelect
        });
        return deletedParent;
    }
}