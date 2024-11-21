import { Injectable } from "@nestjs/common";
import { DepartmentsRepository } from "../repositories/departments.repository";
import { CreateDepartmentDto } from "../dtos/create-department.dto";
import { Department, DepartmentWithDetail } from "../types/department-custom.type";
import { UpdateDepartmentDto } from "../dtos/update-department.dto";
import { Filtering, PaginatedResource, Pagination, Sorting } from "src/interfaces";
import { DepartmentsFacade } from "../facades/departments.facade";

@Injectable()
export class DepartmentsService {

    constructor(
        private readonly departmentsRepository: DepartmentsRepository,
        private readonly departmentsFacade: DepartmentsFacade
    ) {}

    async getDepartments(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<PaginatedResource<DepartmentWithDetail>> {
        const departments = await this.departmentsRepository.findDepartments(pagination, sorts, filters);
        const departmentsWithDetail = await this.departmentsFacade.getDepartmentsWithDetail(departments);
        const departmentCount = await this.departmentsRepository.countDepartments();
        return {
            totalItems: departmentCount,
            items: departmentsWithDetail,
            page: pagination.page,
            size: pagination.size
        };
    }

    async createDepartment(createDepartmentDto: CreateDepartmentDto): Promise<DepartmentWithDetail> {
        return this.departmentsFacade.getDepartmentWithDetail(
            await this.departmentsRepository.createDepartment(createDepartmentDto)
        );
    }

    async updateDepartment(departmentId: string, updateDepartmentDto: UpdateDepartmentDto): Promise<DepartmentWithDetail> {
        return this.departmentsFacade.getDepartmentWithDetail(
            await this.departmentsRepository.updateDepartment(departmentId, updateDepartmentDto)
        );
    }

    deleteDepartment(departmentId: string): Promise<Department> {
        return this.departmentsRepository.deleteDepartment(departmentId);
    }

    async getDepartment(department: Department): Promise<DepartmentWithDetail> {
        return this.departmentsFacade.getDepartmentWithDetail(department);
    }
}