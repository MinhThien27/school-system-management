import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/services/database.service";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { getOrder, getWhere } from "src/helpers";
import { Teacher, teacherSelect } from "../types/teacher-custom.type";
import { Prisma } from "@prisma/client";

@Injectable()
export class TeachersRepository {

    constructor(
        private readonly databaseService: DatabaseService
    ) {}

    async countTeachers(): Promise<number> {
        const teacherCount = await this.databaseService.teacher.count();
        return teacherCount;
    }

    async findTeachers(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<Teacher[]> {
        console.log(getOrder(sorts))
        const teachers = await this.databaseService.teacher.findMany(({
            skip: pagination.offset,
            take: pagination.limit,
            where: getWhere(filters),
            orderBy: {
                ...getOrder(sorts),
                lastName: 'asc'
            },
            select: teacherSelect
        }));
        return teachers;
    }

    async findUniqueTeacher(filterQuery: Prisma.TeacherWhereUniqueInput): Promise<Teacher> {
        const teacher = await this.databaseService.teacher.findUnique({
            where: filterQuery,
            select: teacherSelect
        });
        return teacher;
    }

    async createTeacher(teacherId: string, createTeacherDto: Prisma.TeacherCreateInput, imageUrl?: string): Promise<Teacher> {
        const createdTeacher = await this.databaseService.teacher.create({
            data: { id: teacherId, ...createTeacherDto, imageUrl },
            select: teacherSelect
        });
        return createdTeacher;
    }

    async updateTeacher(teacherId: string, updateTeacherDto: Prisma.TeacherUpdateInput, imageUrl?: string): Promise<Teacher> {
        const updatedTeacher = await this.databaseService.teacher.update({
            where: { id: teacherId },
            data: { ...updateTeacherDto, imageUrl },
            select: teacherSelect
        });
        return updatedTeacher;
    }

    async deleteTeacher(teacherId: string): Promise<Teacher> {
        const deletedTeacher = await this.databaseService.teacher.delete({
            where: { id: teacherId },
            select: teacherSelect
        });
        return deletedTeacher;
    }
}