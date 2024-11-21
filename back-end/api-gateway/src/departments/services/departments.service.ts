import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateDepartmentDto } from "../dtos/create-department.dto";
import { throwError, timeout } from "rxjs";
import { UpdateDepartmentDto } from "../dtos/update-department.dto";
import { Filtering, Pagination, Sorting } from "src/decorators";

@Injectable()
export class DepartmentsService {

    constructor(@Inject('TEACHER_SERVICE') private readonly teacherServiceClient: ClientProxy) {}

    getDepartments(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]) {
        return this.teacherServiceClient.send({ cmd: 'get-departments' }, { pagination, sorts, filters })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    createDepartment(createDepartmentDto: CreateDepartmentDto) {
        return this.teacherServiceClient.send({ cmd: 'create-department' }, { dto: createDepartmentDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            )
    }

    updateDepartment(departmentId: string, updateDepartmentDto: UpdateDepartmentDto) {
        return this.teacherServiceClient.send({ cmd: 'update-department' }, { departmentId, dto: updateDepartmentDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    deleteDepartment(departmentId: string) {
        return this.teacherServiceClient.send({ cmd: 'delete-department' }, departmentId)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    getDepartment(departmentId: string) {
        return this.teacherServiceClient.send({ cmd: 'get-department' }, departmentId)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}