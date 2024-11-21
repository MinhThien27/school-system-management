import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/services/database.service";
import { CreateTeacherClassSubjectDto } from "../dtos/create-teacher-class-subject.dto";
import { TeacherClassSubject, teacherClassSubjectSelect } from "../types/teacher-class-subject-custom.type";
import { Prisma } from "@prisma/client";
import { UpdateTeacherClassSubjectDto } from "../dtos/update-teacher-class-subject.dto";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { getOrder, getWhere } from "src/helpers";

@Injectable()
export class TeacherClassSubjectsRepository {

    constructor(private readonly databaseService: DatabaseService) {}

    async countTeacherClassSubjects(filterQuery: Prisma.TeacherClassSubjectWhereInput): Promise<number> {
        const teacherClassSubjectCount = await this.databaseService.teacherClassSubject.count({
            where: filterQuery
        });
        return teacherClassSubjectCount;
    }

    async findTeacherClassSubjects(teacherId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<TeacherClassSubject[]> {
        const teacherClassSubjects = await this.databaseService.teacherClassSubject.findMany(({
            skip: pagination.offset,
            take: pagination.limit,
            where: { teacherId, ...getWhere(filters) },
            orderBy: getOrder(sorts),
            select: teacherClassSubjectSelect
        }));
        return teacherClassSubjects;
    } 

    async findTeacherClassSubjectsWithFilterQuery(filterQuery: Prisma.TeacherClassSubjectWhereInput): Promise<TeacherClassSubject[]> {
        const teacherClassSubjects = await this.databaseService.teacherClassSubject.findMany({
            where: filterQuery,
            select: teacherClassSubjectSelect
        });
        return teacherClassSubjects;
    }

    async findUniqueTeacherClassSubject(filterQuery: Prisma.TeacherClassSubjectWhereUniqueInput): Promise<TeacherClassSubject> {
        const teacherClassSubject = await this.databaseService.teacherClassSubject.findUnique({
            where: filterQuery,
            select: teacherClassSubjectSelect
        });
        return teacherClassSubject;
    }

    async createTeacherClassSubject(teacherId: string, createTeacherClassSubjectDto: CreateTeacherClassSubjectDto): Promise<TeacherClassSubject> {
        const createdTeacherClassSubject = await this.databaseService.teacherClassSubject.create({
            data: { teacherId, ...createTeacherClassSubjectDto },
            select: teacherClassSubjectSelect
        });
        return createdTeacherClassSubject;
    }

    async updateTeacherClassSubject(teacherId: string, id: string, updateTeacherClassSubjectDto: UpdateTeacherClassSubjectDto): Promise<TeacherClassSubject> {
        const updatedTeacherClassSubject = await this.databaseService.teacherClassSubject.update({
            where: { id },
            data: {
                ...updateTeacherClassSubjectDto,
                teacherId
            },
            select: teacherClassSubjectSelect
        });
        return updatedTeacherClassSubject;
    }

    async deleteTeacherClassSubject(id: string): Promise<TeacherClassSubject> {
        const deletedTeacherClassSubject = await this.databaseService.teacherClassSubject.delete({
            where: { id },
            select: teacherClassSubjectSelect
        });
        return deletedTeacherClassSubject;
    }

    async deleteTeacherClassSubjects(filterQuery: Prisma.TeacherClassSubjectWhereInput): Promise<Prisma.BatchPayload> {
        return await this.databaseService.teacherClassSubject.deleteMany({
            where: filterQuery
        });
    }
}