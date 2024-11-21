import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/services/database.service";
import { CreateDepartmentSubjectDto } from "../dtos/create-department-subject.dto";
import { DepartmentSubject, departmentSubjectSelect } from "../types/department-subject-custom.type";
import { Prisma } from "@prisma/client";
import { UpdateDepartmentSubjectDto } from "../dtos/update-department-subject.dto";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { getOrder, getWhere } from "src/helpers";
import { CreateDepartmentSubjectsDto } from "../dtos/create-department-subjects.dto";
import { UpdateDepartmentSubjectsDto } from "../dtos/update-department-subjects.dto";

@Injectable()
export class DepartmentSubjectsRepository {

    constructor(private readonly databaseService: DatabaseService) {}

    async countDepartmentSubjects(filterQuery: Prisma.DepartmentSubjectWhereInput): Promise<number> {
        const departmentSubjectCount = await this.databaseService.departmentSubject.count({
            where: filterQuery
        });
        return departmentSubjectCount;
    }

    async findDepartmentSubjects(departmentId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<DepartmentSubject[]> {
        const departmentSubjects = await this.databaseService.departmentSubject.findMany(({
            skip: pagination.offset,
            take: pagination.limit,
            where: { departmentId, ...getWhere(filters) },
            orderBy: getOrder(sorts),
            select: departmentSubjectSelect
        }));
        return departmentSubjects;
    } 

    async findDepartmentSubjectsWithSubjectIds(subjectIds: string[]): Promise<DepartmentSubject[]> {
        const departmentSubjects = await this.databaseService.departmentSubject.findMany({
            where: {
                subjectId: {
                    in: subjectIds
                }
            },
            select: departmentSubjectSelect
        });
        return departmentSubjects;
    }

    async findDepartmentSubjectsWithoutQueryParams(filterQuery: Prisma.DepartmentSubjectWhereInput): Promise<DepartmentSubject[]> {
        const departmentSubjects = await this.databaseService.departmentSubject.findMany({
            where: filterQuery,
            select: departmentSubjectSelect
        });
        return departmentSubjects;
    }

    async findUniqueDepartmentSubject(filterQuery: Prisma.DepartmentSubjectWhereUniqueInput): Promise<DepartmentSubject> {
        const departmentSubject = await this.databaseService.departmentSubject.findUnique({
            where: filterQuery,
            select: departmentSubjectSelect
        });
        return departmentSubject;
    }

    async createDepartmentSubject(departmentId: string, createDepartmentSubjectDto: CreateDepartmentSubjectDto): Promise<DepartmentSubject> {
        const createdDepartmentSubject = await this.databaseService.departmentSubject.create({
            data: { departmentId, ...createDepartmentSubjectDto },
            select: departmentSubjectSelect
        });
        return createdDepartmentSubject;
    }

    async createDepartmentSubjects(departmentId: string, { subjectIds }: CreateDepartmentSubjectsDto): Promise<Prisma.BatchPayload> {
        return await this.databaseService.departmentSubject.createMany({
            data: subjectIds.map(subjectId => ({ departmentId, subjectId })),
            skipDuplicates: true
        });
    }

    async updateDepartmentSubject(id: string, updateDepartmentSubjectDto: UpdateDepartmentSubjectDto): Promise<DepartmentSubject> {
        const updatedDepartmentSubject = await this.databaseService.departmentSubject.update({
            where: { id },
            data: updateDepartmentSubjectDto,
            select: departmentSubjectSelect
        });
        return updatedDepartmentSubject;
    }

    async updateDepartmentSubjects(departmentId: string, { subjectIds }: UpdateDepartmentSubjectsDto): Promise<Prisma.BatchPayload> {
        if (!subjectIds) return { count: 0 };
        const result = await this.databaseService.$transaction([
            this.databaseService.departmentSubject.deleteMany({
                where: { departmentId }
            }),
            this.databaseService.departmentSubject.createMany({
                data: subjectIds.map(subjectId => ({ departmentId, subjectId })),
                skipDuplicates: true
            })
        ], {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable
        });
        return result[1];
    }

    async deleteDepartmentSubject(id: string): Promise<DepartmentSubject> {
        const deletedDepartmentSubject = await this.databaseService.departmentSubject.delete({
            where: { id },
            select: departmentSubjectSelect
        });
        return deletedDepartmentSubject;
    }

    async deleteDepartmentSubjects(filterQuery: Prisma.DepartmentSubjectWhereInput): Promise<Prisma.BatchPayload> {
        return await this.databaseService.departmentSubject.deleteMany({
            where: filterQuery
        });
    }
}