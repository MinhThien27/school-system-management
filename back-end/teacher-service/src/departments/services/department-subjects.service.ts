import { Injectable } from "@nestjs/common";
import { CreateDepartmentSubjectDto } from "../dtos/create-department-subject.dto";
import { DepartmentSubject, DepartmentSubjectWithDetail } from "../types/department-subject-custom.type";
import { DepartmentSubjectsRepository } from "../repositories/department-subjects.repository";
import { UpdateDepartmentSubjectDto } from "../dtos/update-department-subject.dto";
import { Filtering, PaginatedResource, Pagination, Sorting } from "src/interfaces";
import { Prisma } from "@prisma/client";
import { CreateDepartmentSubjectsDto } from "../dtos/create-department-subjects.dto";
import { UpdateDepartmentSubjectsDto } from "../dtos/update-department-subjects.dto";
import { DepartmentSubjectsFacade } from "../facades/department-subjects.facade";

@Injectable()
export class DepartmentSubjectsService {

    constructor(
        private readonly departmentSubjectsRepsitory: DepartmentSubjectsRepository,
        private readonly departmentSubjectsFacade: DepartmentSubjectsFacade
    ) {}
    
    async getDepartmentSubjects(
        departmentId: string, 
        pagination: Pagination, 
        sorts?: Sorting[], 
        filters?: Filtering[]
    ): Promise<PaginatedResource<DepartmentSubjectWithDetail>> {
        const departmentSubjects = await this.departmentSubjectsRepsitory.findDepartmentSubjects(departmentId, pagination, sorts, filters);
        const departmentSubjectsWithDetail = await this.departmentSubjectsFacade.getDepartmentSubjectsWithDetail(departmentSubjects);
        const departmentSubjectCount = await this.departmentSubjectsRepsitory.countDepartmentSubjects({ departmentId });
        return {
            totalItems: departmentSubjectCount,
            items: departmentSubjectsWithDetail,
            page: pagination.page,
            size: pagination.size
        };
    }

    async createDepartmentSubject(
        departmentId: string, 
        createDepartmentSubjectDto: CreateDepartmentSubjectDto
    ): Promise<DepartmentSubjectWithDetail> {
        return this.departmentSubjectsFacade.getDepartmentSubjectWithDetail(
            await this.departmentSubjectsRepsitory.createDepartmentSubject(departmentId, createDepartmentSubjectDto)
        );
    }

    createDepartmentSubjects(departmentId: string, createDepartmentsSubjectDto: CreateDepartmentSubjectsDto): Promise<Prisma.BatchPayload> {
        return this.departmentSubjectsRepsitory.createDepartmentSubjects(departmentId, createDepartmentsSubjectDto);
    }

    async udpateDepartmentSubject(
        departmentSubjectId: string, 
        updateDepartmentSubjectDto: UpdateDepartmentSubjectDto
    ): Promise<DepartmentSubjectWithDetail> {
        return this.departmentSubjectsFacade.getDepartmentSubjectWithDetail(
            await this.departmentSubjectsRepsitory.updateDepartmentSubject(departmentSubjectId, updateDepartmentSubjectDto)
        );
    }
    
    udpateDepartmentSubjects(departmentId: string, updateDepartmentSubjectsDto: UpdateDepartmentSubjectsDto): Promise<Prisma.BatchPayload> {
        return this.departmentSubjectsRepsitory.updateDepartmentSubjects(departmentId, updateDepartmentSubjectsDto);
    }

    deleteDepartmentSubject(departmentSubjectId: string): Promise<DepartmentSubject> {
        return this.departmentSubjectsRepsitory.deleteDepartmentSubject(departmentSubjectId);
    }

    getDepartmentSubject(
        departmentSubject: DepartmentSubject
    ): Promise<DepartmentSubjectWithDetail> {
        return this.departmentSubjectsFacade.getDepartmentSubjectWithDetail(departmentSubject);
    }

    deleteDepartmentSubjects(filterQuery: Prisma.DepartmentSubjectWhereInput): Promise<Prisma.BatchPayload> {
        return this.departmentSubjectsRepsitory.deleteDepartmentSubjects(filterQuery);
    }
}