import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/services/database.service";
import { CreateClassStudentDto } from "../dtos/create-class-student.dto";
import { ClassStudent, classStudentSelect } from "../types/class-student-custom.type";
import { Prisma } from "@prisma/client";
import { UpdateClassStudentDto } from "../dtos/update-class-student.dto";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { getOrder, getWhere } from "src/helpers";

@Injectable()
export class ClassStudentsRepository {

    constructor(private readonly databaseService: DatabaseService) {}

    async countClassStudents(filterQuery: Prisma.ClassStudentWhereInput): Promise<number> {
        const classStudentCount = await this.databaseService.classStudent.count({
            where: filterQuery
        });
        return classStudentCount;
    }

    async findClassStudents(classId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<ClassStudent[]> {
        const classStudents = await this.databaseService.classStudent.findMany(({
            skip: pagination.offset,
            take: pagination.limit,
            where: { classId, ...getWhere(filters) },
            orderBy: getOrder(sorts),
            select: classStudentSelect
        }));
        return classStudents;
    } 
    
    async findClassStudentsWithFilterQueryWithoutClassId(filterQuery: Prisma.ClassStudentWhereInput): Promise<ClassStudent[]> {
        const classStudents = await this.databaseService.classStudent.findMany(({
            where: filterQuery,
            select: classStudentSelect
        }));
        return classStudents;
    } 

    async findClassStudentsWithFilterQuery(classId: string, filterQuery: Prisma.ClassStudentWhereInput): Promise<ClassStudent[]> {
        const classStudents = await this.databaseService.classStudent.findMany({
            where: { classId, ...filterQuery },
            select: classStudentSelect
        });
        return classStudents;
    }

    async findUniqueClassStudent(filterQuery: Prisma.ClassStudentWhereUniqueInput): Promise<ClassStudent> {
        const classStudent = await this.databaseService.classStudent.findUnique({
            where: filterQuery,
            select: classStudentSelect
        });
        return classStudent;
    }

    async createClassStudent(classId: string, createClassStudentDto: CreateClassStudentDto): Promise<ClassStudent> {
        const createdClassStudent = await this.databaseService.classStudent.create({
            data: { classId, ...createClassStudentDto },
            select: classStudentSelect
        });
        return createdClassStudent;
    }

    async updateClassStudent(id: string, updateClassStudentDto: UpdateClassStudentDto): Promise<ClassStudent> {
        const updatedClassStudent = await this.databaseService.classStudent.update({
            where: { id },
            data: updateClassStudentDto,
            select: classStudentSelect
        });
        return updatedClassStudent;
    }

    async deleteClassStudent(id: string): Promise<ClassStudent> {
        const deletedClassStudent = await this.databaseService.classStudent.delete({
            where: { id },
            select: classStudentSelect
        });
        return deletedClassStudent;
    }

    async deleteClassStudents(filterQuery: Prisma.ClassStudentWhereInput): Promise<Prisma.BatchPayload> {
        return await this.databaseService.classStudent.deleteMany({
            where: filterQuery
        });
    }
}