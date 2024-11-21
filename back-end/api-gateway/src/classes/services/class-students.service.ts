import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { throwError, timeout } from "rxjs";
import { UpdateClassStudentDto } from "../dtos/update-class-student.dto";
import { Filtering, Pagination, Sorting } from "src/decorators";

@Injectable()
export class ClassStudentsService {

    constructor(@Inject('CLASS_SERVICE') private readonly classServiceClient: ClientProxy) {}

    getClassStudents(classId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]) {
        return this.classServiceClient.send({ cmd: 'get-class-students' }, { classId, pagination, sorts, filters })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    createClassStudent(classId: string, createClassStudentDto) {
        return this.classServiceClient.send({ cmd: 'create-class-student' }, { classId, dto: createClassStudentDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            )
    }

    updateClassStudent(classId: string, classStudentId: string, updateClassStudentDto: UpdateClassStudentDto) {
        return this.classServiceClient.send({ cmd: 'update-class-student' }, { classId, classStudentId, dto: updateClassStudentDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    deleteClasstudent(classId: string, classStudentId: string) {
        return this.classServiceClient.send({ cmd: 'delete-class-student' }, { classId, classStudentId })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    getClasstudent(classId: string, classStudentId: string) {
        return this.classServiceClient.send({ cmd: 'get-class-student' }, { classId, classStudentId })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}