import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { UpdateGradeDto } from "../dtos/update-grade.dto";
import { throwError, timeout } from "rxjs";
import { Filtering, Pagination, Sorting } from "src/decorators";

@Injectable()
export class GradesService {

    constructor(@Inject('STUDENT_SERVICE') private readonly studentServiceClient: ClientProxy) {}

    getGrades(studentId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]) {
        return this.studentServiceClient.send({ cmd: 'get-grades' }, { studentId, pagination, sorts, filters })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            )
    }

    updateGrade(studentId: string, gradeId: string, updateGradeDto: UpdateGradeDto) {
        return this.studentServiceClient.send({ cmd: 'update-grade' }, { studentId, gradeId, dto: updateGradeDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    getGrade(studentId: string, gradeId: string) {
        return this.studentServiceClient.send({ cmd: 'get-grade' }, { studentId, gradeId })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}