import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/services/database.service";
import { CreateDepartmentTeacherDto } from "../dtos/create-department-teacher.dto";
import { DepartmentTeacher, departmentTeacherSelect } from "../types/department-teacher-custom.type";
import { Prisma } from "@prisma/client";
import { UpdateDepartmentTeacherDto } from "../dtos/update-department-teacher.dto";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { getOrder, getWhere } from "src/helpers";

@Injectable()
export class DepartmentTeachersRepository {

    constructor(private readonly databaseService: DatabaseService) { }

    async countDepartmentTeachers(filterQuery: Prisma.DepartmentTeacherWhereInput): Promise<number> {
        const departmentTeacherCount = await this.databaseService.departmentTeacher.count({
            where: filterQuery
        });
        return departmentTeacherCount;
    }

    async findDepartmentTeachers(departmentId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<DepartmentTeacher[]> {
        const departmentTeachers = await this.databaseService.departmentTeacher.findMany(({
            skip: pagination.offset,
            take: pagination.limit,
            where: { departmentId, ...getWhere(filters) },
            orderBy: getOrder(sorts),
            select: departmentTeacherSelect
        }));
        return departmentTeachers;
    }

    async findDepartmentTeachersWithFilterQuery(filterQuery: Prisma.DepartmentTeacherWhereInput): Promise<DepartmentTeacher[]> {
        const departmentTeachers = await this.databaseService.departmentTeacher.findMany(({
            where: filterQuery,
            select: departmentTeacherSelect
        }));
        return departmentTeachers;
    }

    async findUniqueDepartmentTeacher(filterQuery: Prisma.DepartmentTeacherWhereUniqueInput): Promise<DepartmentTeacher> {
        const departmentTeacher = await this.databaseService.departmentTeacher.findUnique({
            where: filterQuery,
            select: departmentTeacherSelect
        });
        return departmentTeacher;
    }

    async findDepartmentTeacher(filterQuery: Prisma.DepartmentTeacherWhereInput): Promise<DepartmentTeacher> {
        const departmentTeacher = await this.databaseService.departmentTeacher.findFirst({
            where: filterQuery,
            select: departmentTeacherSelect
        });
        return departmentTeacher;
    }

    async createDepartmentTeacher(departmentId: string, createDepartmentTeacherDto: CreateDepartmentTeacherDto): Promise<DepartmentTeacher> {
        const { subjectIds, ...createDepartmentTeacher } = createDepartmentTeacherDto;
        const createAvailableSubjects = subjectIds?.map(subjectId => ({ subjectId }));
        const createdDepartmentTeacher = await this.databaseService.departmentTeacher.create({
            data: {
                departmentId,
                ...createDepartmentTeacher,
                availableSubjects: !createAvailableSubjects ? undefined : {
                    createMany: {
                        data: createAvailableSubjects,
                        skipDuplicates: true
                    }
                }
            },
            select: departmentTeacherSelect
        });
        return createdDepartmentTeacher;
    }

    async updateDepartmentTeacher(id: string, updateDepartmentTeacherDto: UpdateDepartmentTeacherDto): Promise<DepartmentTeacher> {
        const { subjectIds, ...updateDepartmentTeacher } = updateDepartmentTeacherDto;
        const updateSubjectIds = subjectIds ? subjectIds : [];
        const departmentSubjectIds = (await this.databaseService.availableTeacherSubject.findMany({
            where: { departmentTeacherId: id }
        })).map(availableTeacherSubject => availableTeacherSubject.subjectId);
        const createAvailableSubjects: string[] = [];
        let deletedAvailableSubjects: string[] = [];
        const remainingAvailableSubjects: string[] = [];
        for (const updateSubjectId of updateSubjectIds) {
            if (!departmentSubjectIds.includes(updateSubjectId)) {
                createAvailableSubjects.push(updateSubjectId);
                continue;
            }
            remainingAvailableSubjects.push(updateSubjectId);
        }
        deletedAvailableSubjects = departmentSubjectIds.filter(departmentSubjectId => !remainingAvailableSubjects.includes(departmentSubjectId));
        const result = await this.databaseService.$transaction([
            this.databaseService.availableTeacherSubject.deleteMany({
                where: {
                    subjectId: {
                        in: deletedAvailableSubjects
                    }
                }
            }),
            this.databaseService.availableTeacherSubject.createMany({
                data: createAvailableSubjects.map(subjectId => ({ departmentTeacherId: id, subjectId })),
                skipDuplicates: true
            }),
            this.databaseService.departmentTeacher.update({
                where: { id },
                data: updateDepartmentTeacher,
                select: departmentTeacherSelect
            })
        ], {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable
        })
        return result[2];
    }

    async deleteDepartmentTeacher(id: string): Promise<DepartmentTeacher> {
        const deletedDepartmentTeacher = await this.databaseService.departmentTeacher.delete({
            where: { id },
            select: departmentTeacherSelect
        });
        return deletedDepartmentTeacher;
    }
}