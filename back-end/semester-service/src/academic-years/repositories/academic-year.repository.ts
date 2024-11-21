import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/services/database.service";
import { Prisma } from "@prisma/client";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { getOrder, getWhere } from "src/helpers";
import { AcademicYear, academicYearSelect } from "../types/academic-year-custom.type";
import { UpdateAcademicYearDto } from "../dtos/update-academic-year.dto";
import { CreateAcademicYearDto } from "../dtos/craete-academic-year.dto";

@Injectable()
export class AcademicYearsRepository {
    
    constructor(private readonly databaseService: DatabaseService) {}

    async countAcademicYears(): Promise<number> {
        const academicYearCount = await this.databaseService.academicYear.count();
        return academicYearCount;
    }

    async findAcademicYears(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<AcademicYear[]> {
        const academicYears = await this.databaseService.academicYear.findMany(({
            skip: pagination.offset,
            take: pagination.limit,
            where: getWhere(filters),
            orderBy: getOrder(sorts),
            select: academicYearSelect
        }));
        return academicYears;
    } 
    
    async findAcademicYearsWithFilterQuery(filterQuery: Prisma.AcademicYearWhereInput, sort?: Prisma.AcademicYearOrderByWithAggregationInput): Promise<AcademicYear[]> {
        const academicYears = await this.databaseService.academicYear.findMany(({
            where: filterQuery,
            orderBy: sort,
            select: academicYearSelect
        }));
        return academicYears;
    } 

    async findUniqueAcademicYear(filterQuery: Prisma.AcademicYearWhereUniqueInput): Promise<AcademicYear> {
        const academicYear = await this.databaseService.academicYear.findUnique({
            where: filterQuery,
            select: academicYearSelect
        })
        return academicYear;
    }

    async createAcademicYear(numberOfSemesters: number, createAcademicYearDto: CreateAcademicYearDto): Promise<AcademicYear> {
        const createdAcademicYear = await this.databaseService.academicYear.create({
            data: {
                ...createAcademicYearDto,
                numberOfSemesters,
                startDate: new Date(createAcademicYearDto.startDate),
                endDate: new Date(createAcademicYearDto.endDate)
            },
            select: academicYearSelect
        });
        return createdAcademicYear;
    }

    async updateAcademicYear(id: string, updateAcademicYearDto: UpdateAcademicYearDto): Promise<AcademicYear> {
        const startDate = updateAcademicYearDto.startDate ? new Date(updateAcademicYearDto.startDate) : undefined;
        const endDate = updateAcademicYearDto.endDate ? new Date(updateAcademicYearDto.endDate) : undefined;
        const updatedAcademicYear = await this.databaseService.academicYear.update({
            where: { id },
            data: { ...updateAcademicYearDto, startDate, endDate },
            select: academicYearSelect
        });
        return updatedAcademicYear;
    }

    async deleteAcademicYear(id: string): Promise<AcademicYear> {
        const deletedAcademicYear = await this.databaseService.academicYear.delete({
            where: { id },
            select: academicYearSelect
        });
        return deletedAcademicYear;
    }
}