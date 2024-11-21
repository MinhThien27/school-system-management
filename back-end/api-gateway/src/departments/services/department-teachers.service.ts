import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateDepartmentTeacherDto } from "../dtos/create-department-teacher.dto";
import { throwError, timeout } from "rxjs";
import { UpdateDepartmentTeacherDto } from "../dtos/update-department-teacher.dto";
import { Filtering, Pagination, Sorting } from "src/decorators";

@Injectable()
export class DepartmentTeachersService {

    constructor(@Inject('TEACHER_SERVICE') private readonly teacherServiceClient: ClientProxy) {}

    getDepartmentTeachers(departmentId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]) {
        return this.teacherServiceClient.send({ cmd: 'get-department-teachers' }, { departmentId, pagination, sorts, filters })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    createDepartmentTeacher(departmentId: string, createDepartmentTeacherDto: CreateDepartmentTeacherDto) {
        return this.teacherServiceClient.send({ cmd: 'create-department-teacher' }, { departmentId, dto: createDepartmentTeacherDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    updateDepartmentTeacher(departmentId: string, departmentTeacherId: string, updateDepartmentTeacherDto: UpdateDepartmentTeacherDto) {
        return this.teacherServiceClient.send({ cmd: 'update-department-teacher' }, { departmentId, departmentTeacherId, dto: updateDepartmentTeacherDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    deleteDepartmentTeacher(departmentId: string, departmentTeacherId: string) {
        return this.teacherServiceClient.send({ cmd: 'delete-department-teacher' }, { departmentId, departmentTeacherId })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    getDepartmentTeacher(departmentId: string, departmentTeacherId: string) {
        return this.teacherServiceClient.send({ cmd: 'get-department-teacher' }, { departmentId, departmentTeacherId })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}