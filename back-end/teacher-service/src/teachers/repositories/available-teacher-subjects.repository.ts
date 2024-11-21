import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DatabaseService } from "src/database/services/database.service";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { AvailableTeacherSubject, availableTeacherSubjectSelect } from "../types/available-teacher-subject-custom.type";
import { getOrder, getWhere } from "src/helpers";

@Injectable()
export class AvailableTeacherSubjectsRepository {

    constructor(private readonly databaseService: DatabaseService) {}

    async countAvailableTeacherSubjects(filterQuery: Prisma.AvailableTeacherSubjectWhereInput): Promise<number> {
        const teacherClassSubjectCount = await this.databaseService.availableTeacherSubject.count({
            where: filterQuery
        });
        return teacherClassSubjectCount;
    }

    async findAvailableTeacherSubjects(
        teacherId: string, 
        pagination: Pagination, 
        sorts?: Sorting[], 
        filters?: Filtering[]
    ): Promise<AvailableTeacherSubject[]> {
        const availableTeacherSubjects = await this.databaseService.availableTeacherSubject.findMany(({
            skip: pagination.offset,
            take: pagination.limit,
            where: {
                ...getWhere(filters),
                departmentTeacher: {
                    teacher: {
                        id: teacherId
                    }
                }
            },
            orderBy: getOrder(sorts),
            select: availableTeacherSubjectSelect
        }));
        return availableTeacherSubjects;
    } 

    async findAvailableTeacherSubjectsWithFilterQuery(
        filterQuery: Prisma.AvailableTeacherSubjectWhereInput
    ): Promise<AvailableTeacherSubject[]> {
        const availableTeacherSubjects = await this.databaseService.availableTeacherSubject.findMany(({
            where: filterQuery,
            select: availableTeacherSubjectSelect
        }));
        return availableTeacherSubjects;
    } 
}