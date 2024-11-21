import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/services/database.service";
import { Semester, semesterSelect } from "../types/semester-custom.type";
import { Prisma } from "@prisma/client";
import { CreateSemesterDto } from "../dtos/create-semester.dto";
import { UpdateSemesterDto } from "../dtos/update-semester.dto";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { getOrder, getWhere } from "src/helpers";

@Injectable()
export class SemestersRepository {
    
    constructor(private readonly databaseService: DatabaseService) {}

    async countSemesters(filterQuery: Prisma.SemesterWhereInput): Promise<number> {
        const semesterCount = await this.databaseService.semester.count({ where: filterQuery });
        return semesterCount;
    }

    async findSemesters(academicYearId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<Semester[]> {
        const semesters = await this.databaseService.semester.findMany(({
            skip: pagination.offset,
            take: pagination.limit,
            where: { academicYearId, ...getWhere(filters) },
            orderBy: getOrder(sorts),
            select: semesterSelect
        }));
        return semesters;
    } 

    async findSemestersWithFilterQuery(filterQuery: Prisma.SemesterWhereInput, sort?: Prisma.SemesterOrderByWithAggregationInput): Promise<Semester[]> {
        const semesters = await this.databaseService.semester.findMany(({
            where: filterQuery,
            orderBy: sort,
            select: semesterSelect
        }));
        return semesters;
    } 

    async findUniqueSemester(filterQuery: Prisma.SemesterWhereUniqueInput): Promise<Semester> {
        const semester = await this.databaseService.semester.findUnique({
            where: filterQuery,
            select: semesterSelect
        });
        return semester;
    }
    
    async createSemester(academicYearId: string, createSemesterDto: CreateSemesterDto, semesterNumber: number): Promise<Semester> {
        const createdSemester = await this.databaseService.semester.create({
            data: {
                academicYearId,
                semesterNumber,
                ...createSemesterDto,
                startDate: new Date(createSemesterDto.startDate),
                endDate: new Date(createSemesterDto.endDate)
            },
            select: semesterSelect
        });
        return createdSemester;
    }

    async updateSemester(id: string, updateSemesterDto: UpdateSemesterDto): Promise<Semester> {
        const startDate = updateSemesterDto.startDate ? new Date(updateSemesterDto.startDate) : undefined;
        const endDate = updateSemesterDto.endDate ? new Date(updateSemesterDto.endDate) : undefined;
        const updatedSemester = await this.databaseService.semester.update({
            where: { id },
            data: { ...updateSemesterDto, startDate, endDate },
            select: semesterSelect
        });
        return updatedSemester;
    }

    async deleteSemester(id: string): Promise<Semester> {
        const deletedSemester = await this.databaseService.semester.delete({
            where: { id },
            select: semesterSelect
        });
        return deletedSemester;
    }
}