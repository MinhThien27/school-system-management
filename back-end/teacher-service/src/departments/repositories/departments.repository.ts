import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/services/database.service";
import { CreateDepartmentDto } from "../dtos/create-department.dto";
import { Department, departmentSelect } from "../types/department-custom.type";
import { UpdateDepartmentDto } from "../dtos/update-department.dto";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { getOrder, getWhere } from "src/helpers";
import { Prisma } from "@prisma/client";

@Injectable()
export class DepartmentsRepository {

    constructor(private readonly databaseService: DatabaseService) {}
    
    async countDepartments(): Promise<number> {
        const departmentCount = await this.databaseService.department.count();
        return departmentCount;
    }

    async findDepartments(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<Department[]> {
        const departments = await this.databaseService.department.findMany(({
            skip: pagination.offset,
            take: pagination.limit,
            where: getWhere(filters),
            orderBy: getOrder(sorts),
            select: departmentSelect
        }));
        return departments;
    } 

    async findUniqueDepartment(filterQuery: Prisma.DepartmentWhereUniqueInput): Promise<Department> {
        const department = await this.databaseService.department.findUnique({
            where: filterQuery,
            select: departmentSelect
        });
        return department;
    }

    async createDepartment(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
        const createdDepartment = await this.databaseService.department.create({
            data: createDepartmentDto,
            select: departmentSelect
        });
        return createdDepartment;
    }

    async updateDepartment(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
        const updatedDepartment = await this.databaseService.department.update({
            where: { id },
            data: updateDepartmentDto,
            select: departmentSelect
        });
        return updatedDepartment;
    }

    async deleteDepartment(id: string): Promise<Department> {
        const deletedDepartment = await this.databaseService.department.delete({
            where: { id },
            select: departmentSelect
        });
        return deletedDepartment;
    }
}