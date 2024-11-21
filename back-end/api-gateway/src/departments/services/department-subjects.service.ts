import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateDepartmentSubjectDto } from "../dtos/create-department-subject.dto";
import { throwError, timeout } from "rxjs";
import { UpdateDepartmentSubjectDto } from "../dtos/update-department-subject.dto";
import { Filtering, Pagination, Sorting } from "src/decorators";
import { CreateDepartmentSubjectsDto } from "../dtos/create-department-subjects.dto";
import { UpdateDepartmentSubjectsDto } from "../dtos/update-department-subjects.dto";

@Injectable()
export class DepartmentSubjectsService {

    constructor(@Inject('TEACHER_SERVICE') private readonly teacherServiceClient: ClientProxy) {}

    getDepartmentSubjects(departmentId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]) {
        return this.teacherServiceClient.send({ cmd: 'get-department-subjects' }, { departmentId, pagination, sorts, filters })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    createDepartmentSubject(departmentId: string, createDepartmentSubjectDto: CreateDepartmentSubjectDto) {
        return this.teacherServiceClient.send({ cmd: 'create-department-subject' }, { departmentId, dto: createDepartmentSubjectDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    createDepartmentSubjects(departmentId: string, createDepartmentSubjectsDto: CreateDepartmentSubjectsDto) {
        return this.teacherServiceClient.send({ cmd: 'create-department-subjects' }, { departmentId, dto: createDepartmentSubjectsDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    updateDepartmentSubject(departmentId: string, departmentSubjectId: string, updateDepartmentSubjectDto: UpdateDepartmentSubjectDto) {
        return this.teacherServiceClient.send({ cmd: 'update-department-subject' }, { departmentId, departmentSubjectId, dto: updateDepartmentSubjectDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    updateDepartmentSubjects(departmentId: string, updateDepartmentSubjectsDto: UpdateDepartmentSubjectsDto) {
        return this.teacherServiceClient.send({ cmd: 'update-department-subjects' }, { departmentId, dto: updateDepartmentSubjectsDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    deleteDepartmentSubject(departmentId: string, departmentSubjectId: string) {
        return this.teacherServiceClient.send({ cmd: 'delete-department-subject' }, { departmentId, departmentSubjectId })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    getDepartmentSubject(departmentId: string, departmentSubjectId: string) {
        return this.teacherServiceClient.send({ cmd: 'get-department-subject' }, { departmentId, departmentSubjectId })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}