import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/services/database.service";
import { Grade, gradeSelect } from "../types/grade-custom.type";
import { Prisma } from "@prisma/client";
import { UpdateGradeDto } from "../dtos/update-grade.dto";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { getOrder, getWhere } from "src/helpers";

@Injectable()
export class GradesRepository {

    constructor(private readonly databaseService: DatabaseService) {}

    async countGrades(filterQuery: Prisma.GradeWhereInput): Promise<number> {
        const gradeCount = await this.databaseService.grade.count({
            where: filterQuery
        });
        return gradeCount;
    }

    async findGrades(studentId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<Grade[]> {
        const grades = await this.databaseService.grade.findMany(({
            skip: pagination.offset,
            take: pagination.limit,
            where: { studentId, ...getWhere(filters) },
            orderBy: getOrder(sorts),
            select: gradeSelect
        }));
        return grades;
    }

    async findGradesWithFilterQuery(filterQuery: Prisma.GradeWhereInput): Promise<Grade[]> {
        const grades = await this.databaseService.grade.findMany({
            where: filterQuery,
            orderBy: {
                student: {
                    lastName: 'asc'
                }
            },
            select: gradeSelect
        });
        return grades;
    }

    async findUniqueGrade(filterQuery: Prisma.GradeWhereUniqueInput): Promise<Grade> {
        const grade = await this.databaseService.grade.findUnique({
            where: filterQuery,
            select: gradeSelect
        });
        return grade;
    }

    async createGradeForStudents(studentIds: string[], classSubjectId: string): Promise<Prisma.BatchPayload> {
        const grades = studentIds.map(studentId => ({
            studentId,
            classSubjectId
        }))
        return await this.databaseService.grade.createMany({
            data: grades
        });
    }

    async createGradesForStudent(classSubjectIds: string[], studentId: string): Promise<Prisma.BatchPayload> {
        const grades = classSubjectIds.map(classSubjectId => ({
            classSubjectId,
            studentId
        }));
        return await this.databaseService.grade.createMany({
            data: grades
        });
    }

    async updateGrade(id: string, updateGradeDto: UpdateGradeDto): Promise<Grade> {
        const updatedGrade = await this.databaseService.grade.update({
            where: { id },
            data: updateGradeDto,
            select: gradeSelect
        });
        return updatedGrade;
    }

    async updateGradeWithFilterQuery(filterQuery: Prisma.GradeWhereUniqueInput, updateGradeDto: Prisma.GradeUpdateInput): Promise<Grade> {
        const updatedGrade = await this.databaseService.grade.update({
            where: filterQuery,
            data: updateGradeDto,
            select: gradeSelect
        });
        return updatedGrade;
    }

    async deleteGrades(filterQuery: Prisma.GradeWhereInput): Promise<Prisma.BatchPayload> {
        return await this.databaseService.grade.deleteMany({
            where: filterQuery
        });
    }
}