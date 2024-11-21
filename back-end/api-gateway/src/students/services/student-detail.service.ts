import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateStudentDetailDto } from "../dtos/create-student-detail.dto";
import { throwError, timeout } from "rxjs";
import { UpdateStudentDetailDto } from "../dtos/update-student-detail.dto";

@Injectable()
export class StudentDetailService {

    constructor(@Inject('STUDENT_SERVICE') private readonly studentsServiceClient: ClientProxy) { }

    getStudentDetail(studentId: string) {
        return this.studentsServiceClient.send({ cmd: 'get-student-detail' }, studentId)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    createStudentDetail(studentId: string, createStudentDetailDto: CreateStudentDetailDto) {
        return this.studentsServiceClient.send({ cmd: 'create-student-detail' }, { studentId, dto: createStudentDetailDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    updateStudentDetail(studentId: string, studentDetailId: string, updateStudentDetailDto: UpdateStudentDetailDto) {
        return this.studentsServiceClient.send({ cmd: 'update-student-detail' }, { studentId, studentDetailId, dto: updateStudentDetailDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    deleteStudentDetail(studentId: string, studentDetailId: string) {
        return this.studentsServiceClient.send({ cmd: 'delete-student-detail' }, { studentId, studentDetailId })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}