import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { throwError, timeout } from "rxjs";
import { Filtering, Pagination, Sorting } from "src/decorators";
import { CreateAcademicYearDto } from "../dtos/create-academic-year.dto";
import { UpdateAcademicYearDto } from "../dtos/update-academic-year.dto";

@Injectable()
export class AcademicYearsService {

    constructor(@Inject('SEMESTER_SERVICE') private readonly semesterServiceClient: ClientProxy) {}

    getAcademicYears(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]) {
        return this.semesterServiceClient.send({ cmd: 'get-academic-years' }, { pagination, sorts, filters })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    createAcademicYear(createAcademicYearDto: CreateAcademicYearDto) {
        return this.semesterServiceClient.send({ cmd: 'create-academic-year' }, { dto: createAcademicYearDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    updateAcademicYear(academicYearId: string, updateAcademicYearDto: UpdateAcademicYearDto) {
        return this.semesterServiceClient.send({ cmd: 'update-academic-year' }, { academicYearId, dto: updateAcademicYearDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    deleteAcademicYear(academicYearId: string) {
        return this.semesterServiceClient.send({ cmd: 'delete-academic-year' }, academicYearId)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    getAcademicYear(academicYearId: string) {
        return this.semesterServiceClient.send({ cmd: 'get-academic-year' }, academicYearId)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}