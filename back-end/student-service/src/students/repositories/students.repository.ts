import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/services/database.service";
import { Student, studentSelect } from "../types/student-custom.type";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { getOrder, getWhere } from "src/helpers";
import { Prisma } from "@prisma/client";

@Injectable()
export class StudentsRepository {

    constructor(
        private readonly databaseService: DatabaseService
    ) {}

    async countStudents(): Promise<number> {
        const studentCount = await this.databaseService.student.count();
        return studentCount;
    }

    async findStudents(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<Student[]> {
        const students = await this.databaseService.student.findMany(({
            skip: pagination.offset,
            take: pagination.limit,
            where: getWhere(filters),
            orderBy: {
                ...getOrder(sorts),
                lastName: 'asc'
            },
            select: studentSelect
        }));
        return students;
    }

    async findUniqueStudent(filterQuery: Prisma.StudentWhereUniqueInput): Promise<Student> {
        const student = await this.databaseService.student.findUnique({
            where: filterQuery,
            select: studentSelect
        });
        return student;
    }

    async findStudent(filterQuery: Prisma.StudentWhereInput): Promise<Student> {
        const student = await this.databaseService.student.findFirst({
            where: filterQuery,
            select: studentSelect
        });
        return student;
    }

    async createStudent(studentId: string, createStudentDto: Prisma.StudentCreateInput, imageUrl?: string): Promise<Student> {
        const createdStudent = await this.databaseService.student.create({
            data: { id: studentId, ...createStudentDto, imageUrl },
            select: studentSelect
        });
        return createdStudent;
    }

    async updateStudent(studentId: string, updateStudentDto: Prisma.StudentUpdateInput, imageUrl?: string): Promise<Student> {
        const updatedStudent = await this.databaseService.student.update({
            where: { id: studentId },
            data: { ...updateStudentDto, imageUrl },
            select: studentSelect
        });
        return updatedStudent;
    }

    async deleteStudent(studentId: string): Promise<Student> {
        const deletedStudent = await this.databaseService.student.delete({
            where: { id: studentId },
            select: studentSelect
        });
        return deletedStudent;
    }
}