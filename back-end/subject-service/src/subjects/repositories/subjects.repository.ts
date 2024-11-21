import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/services/database.service";
import { Subject, subjectSelect } from "../types/subject-custom.type";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { getOrder, getWhere } from "src/helpers";
import { Prisma } from "@prisma/client";

@Injectable()
export class SubjectsRepository {
    
    constructor(private readonly databaseService: DatabaseService) {}

    async countSubjects(): Promise<number> {
        const subjectCount = await this.databaseService.subject.count();
        return subjectCount;
    }

    async findSubjects(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<Subject[]> {
        // console.log({ 1: pagination.offset, 2: pagination.limit })
        const subjects = await this.databaseService.subject.findMany(({
            skip: pagination.offset,
            take: pagination.limit,
            where: getWhere(filters),
            orderBy: getOrder(sorts),
            select: subjectSelect
        }));
        return subjects;
    } 

    async findSubjectsWithSUbjectIds(subjectIds: string[]): Promise<Subject[]> {
        const subjects = await this.databaseService.subject.findMany({
            where: {
                id: {
                    in: subjectIds
                }
            }
        });
        return subjects;
    }

    async findUniqueSubject(filterQuery: Prisma.SubjectWhereUniqueInput): Promise<Subject> {
        const subject = await this.databaseService.subject.findUnique({
            where: filterQuery,
            select: subjectSelect
        });
        return subject;
    }

    async createSubject(createSubjectDto: Prisma.SubjectCreateInput): Promise<Subject> {
        const createdSubject = await this.databaseService.subject.create({
            data: createSubjectDto,
            select: subjectSelect
        });
        return createdSubject;
    }

    async updateSubject(id: string, updateSubjectDto: Prisma.SubjectUpdateInput): Promise<Subject> {
        const updatedSubject = await this.databaseService.subject.update({
            where: { id },
            data: updateSubjectDto,
            select: subjectSelect
        });
        return updatedSubject;
    }

    async deleteSubject(id: string): Promise<Subject> {
        const deletedSubject = await this.databaseService.subject.delete({
            where: { id },
            select: subjectSelect
        });
        return deletedSubject;
    }
}