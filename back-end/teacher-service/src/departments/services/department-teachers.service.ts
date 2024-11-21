import { Injectable } from "@nestjs/common";
import { DepartmentTeachersRepository } from "../repositories/department-teachers.repository";
import { CreateDepartmentTeacherDto } from "../dtos/create-department-teacher.dto";
import { DepartmentTeacher, DepartmentTeacherWithDetail } from "../types/department-teacher-custom.type";
import { UpdateDepartmentTeacherDto } from "../dtos/update-department-teacher.dto";
import { Filtering, PaginatedResource, Pagination, Sorting } from "src/interfaces";
import { Prisma } from "@prisma/client";
import { AvailableTeacherSubjectsRepository } from "../repositories/available-teacher-subjects.repository";
import { DepartmentTeachersFacade } from "../facades/department-teachers.facade";

@Injectable()
export class DepartmentTeachersService {

    constructor(
        private readonly departmentTeachersRepository: DepartmentTeachersRepository,
        private readonly availableTeacherSubjectsRepository: AvailableTeacherSubjectsRepository,
        private readonly departmentTeachersFacacde: DepartmentTeachersFacade
    ) {}
       
    async getDepartmentTeachers(
        departmentId: string, 
        pagination: Pagination, sorts?: 
        Sorting[], 
        filters?: Filtering[]
    ): Promise<PaginatedResource<DepartmentTeacherWithDetail>> {
        const departmentTeachers = await this.departmentTeachersRepository.findDepartmentTeachers(departmentId, pagination, sorts, filters);
        const departmentTeachersWithDetail = await this.departmentTeachersFacacde.getDepartmentTeachersWithDetail(departmentTeachers);
        const departmentTeacherCount = await this.departmentTeachersRepository.countDepartmentTeachers({ departmentId });
        return {
            totalItems: departmentTeacherCount,
            items: departmentTeachersWithDetail,
            page: pagination.page,
            size: pagination.size
        };
    }

    async createDepartmentTeacher(
        departmentId: string, 
        createDepartmentTeacherDto: CreateDepartmentTeacherDto
    ): Promise<DepartmentTeacherWithDetail> {
        return this.departmentTeachersFacacde.getDepartmentTeacherWithDetail(
            await this.departmentTeachersRepository.createDepartmentTeacher(departmentId, createDepartmentTeacherDto)
        );
    }

    async updateDepartmentTeacher(
        departmentTeacherId: string, 
        updateDepartmentTeacherDto: UpdateDepartmentTeacherDto
    ): Promise<DepartmentTeacherWithDetail> {
        return this.departmentTeachersFacacde.getDepartmentTeacherWithDetail(
            await this.departmentTeachersRepository.updateDepartmentTeacher(departmentTeacherId, updateDepartmentTeacherDto)
        );
    }

    deleteDepartmentTeacher(departmentTeacherId: string): Promise<DepartmentTeacher> {
        return this.departmentTeachersRepository.deleteDepartmentTeacher(departmentTeacherId);
    }

    async getDepartmentTeacher(
        departmentTeacher: DepartmentTeacher
    ): Promise<DepartmentTeacherWithDetail> {
        return this.departmentTeachersFacacde.getDepartmentTeacherWithDetail(departmentTeacher);
    }

    deleteAvailableTeacherSubjects(filterQuery: Prisma.AvailableTeacherSubjectWhereInput): Promise<Prisma.BatchPayload> {
        return this.availableTeacherSubjectsRepository.deleteAvailableTeacherSubjects(filterQuery);
    }
}