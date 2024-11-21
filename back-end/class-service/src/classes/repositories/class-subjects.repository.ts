import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/services/database.service";
import { CreateclassSubjectDto } from "../dtos/create-class-subject.dto";
import { ClassSubject, classSubjectSelect } from "../types/class-subject-custom.type";
import { Prisma } from "@prisma/client";
import { UpdateClassSubjectDto } from "../dtos/update-class-subject.dto";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { getOrder, getWhere } from "src/helpers";

@Injectable()
export class ClassSubjectsRepository {

    constructor(private readonly databaseService: DatabaseService) {}

    async countClassSubjects(filterQuery: Prisma.ClassSubjectWhereInput): Promise<number> {
        const classSubjectCount = await this.databaseService.classSubject.count({
            where: filterQuery
        });
        return classSubjectCount;
    }

    async findClassSubjects(classId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<ClassSubject[]> {
        const classSubjects = await this.databaseService.classSubject.findMany(({
            skip: pagination.offset,
            take: pagination.limit,
            where: { classId, ...getWhere(filters) },
            orderBy: getOrder(sorts),
            select: classSubjectSelect
        }));
        return classSubjects;
    } 

    async findClassSubjectsWithFilterQuery(classId: string, filterQuery: Prisma.ClassSubjectWhereInput): Promise<ClassSubject[]> {
        const classSubjects = await this.databaseService.classSubject.findMany({
            where: { classId, ...filterQuery },
            select: classSubjectSelect
        });
        return classSubjects;
    }

    async findClassSubjectsWithFilterQueryWithoutClassId(filterQuery: Prisma.ClassSubjectWhereInput): Promise<ClassSubject[]> {
        const classSubjects = await this.databaseService.classSubject.findMany({
            where: filterQuery,
            select: classSubjectSelect
        });
        return classSubjects;
    }

    async findUniqueClassSubject(filterQuery: Prisma.ClassSubjectWhereUniqueInput): Promise<ClassSubject> {
        const classSubject = await this.databaseService.classSubject.findUnique({
            where: filterQuery,
            select: classSubjectSelect
        });
        return classSubject;
    }

    async createClassSubject(classId: string, createClassSubjectDto: CreateclassSubjectDto): Promise<ClassSubject> {
        const startDate = createClassSubjectDto.startDate ? new Date(createClassSubjectDto.startDate) : undefined;
        const endDate = createClassSubjectDto.endDate ? new Date(createClassSubjectDto.endDate) : undefined;
        const createdClassSubject = await this.databaseService.classSubject.create({
            data: { ...createClassSubjectDto, startDate, endDate, classId },
            select: classSubjectSelect
        });
        return createdClassSubject;
    }
    
    async updateClassSubject(id: string, updateClassSubjectDto: UpdateClassSubjectDto): Promise<ClassSubject> {
        const startDate = updateClassSubjectDto.startDate ? new Date(updateClassSubjectDto.startDate) : undefined;
        const endDate = updateClassSubjectDto.endDate ? new Date(updateClassSubjectDto.endDate) : undefined;
        const updatedClassSubject = await this.databaseService.classSubject.update({
            where: { id },
            data: { ...updateClassSubjectDto, startDate, endDate },
            select: classSubjectSelect
        });
        return updatedClassSubject;
    }

    async deleteClassSubject(id: string): Promise<ClassSubject> {
        const deletedClassSubject = await this.databaseService.classSubject.delete({
            where: { id },
            select: classSubjectSelect
        });
        return deletedClassSubject;
    }
}