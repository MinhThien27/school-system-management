import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateSemesterDto } from "../dtos/create-semester.dto";
import { throwError, timeout } from "rxjs";
import { UpdateSemesterDto } from "../dtos/update-semester.dto";
import { Filtering, Pagination, Sorting } from "src/decorators";

@Injectable()
export class SemestersService {

    constructor(@Inject('SEMESTER_SERVICE') private readonly semesterServiceClient: ClientProxy) {}

    getSemesters(academicYearId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]) {
        return this.semesterServiceClient.send({ cmd: 'get-semesters' }, { academicYearId, pagination, sorts, filters })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    createSemester(academicYearId: string, createSemesterDto: CreateSemesterDto) {
        return this.semesterServiceClient.send({ cmd: 'create-semester' }, { academicYearId, dto: createSemesterDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    updateSemester(academicYearId: string, semesterId: string, updateSemesterDto: UpdateSemesterDto) {
        return this.semesterServiceClient.send({ cmd: 'update-semester' }, { academicYearId, semesterId, dto: updateSemesterDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    deleteSemester(academicYearId: string, semesterId: string) {
        return this.semesterServiceClient.send({ cmd: 'delete-semester' }, { academicYearId, semesterId })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    getSemester(academicYearId: string, semesterId: string) {
        return this.semesterServiceClient.send({ cmd: 'get-semester' }, { academicYearId, semesterId })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}