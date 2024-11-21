import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { Filtering, PaginatedResource, Pagination, Sorting } from "src/interfaces";
import { AcademicYearsRepository } from "../repositories/academic-year.repository";
import { AcademicYear } from "../types/academic-year-custom.type";
import { CreateAcademicYearDto } from "../dtos/craete-academic-year.dto";
import { UpdateAcademicYearDto } from "../dtos/update-academic-year.dto";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { DeleteAcademicYearSagaState } from "../sagas/delete-academic-year/delete-academic-year-saga-state";
import { DeleteAcademicYearSaga } from "../sagas/delete-academic-year/delete-academic-year.saga";

@Injectable()
export class AcademicYearsService {
    
    constructor(
        private readonly academicYearsRepository: AcademicYearsRepository,
        @Inject('CONFIGURATION_SERVICE') private readonly curriculumServiceClient: ClientProxy,
        @Inject('CLASS_SERVICE') private readonly classServiceClient: ClientProxy
    ) {}

    async getAcademicYears(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<PaginatedResource<AcademicYear>> {
        const academicYears = await this.academicYearsRepository.findAcademicYears(pagination, sorts, filters);
        const academicYearCount = await this.academicYearsRepository.countAcademicYears();
        return {
            totalItems: academicYearCount,
            items: academicYears,
            page: pagination.page,
            size: pagination.size
        };
    }

    async createAcademicYear(createAcademicYearDto: CreateAcademicYearDto): Promise<AcademicYear> {
        const schoolConfiguration = await firstValueFrom(this.curriculumServiceClient.send(
            { cmd: 'get-school-configuration' },
            {}
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutException())
        })));
        return this.academicYearsRepository.createAcademicYear(schoolConfiguration.numberOfSemesters, createAcademicYearDto);
    }

    updateAcademicYear(academicYearId: string, updateAcademicYearDto: UpdateAcademicYearDto): Promise<AcademicYear> {
        return this.academicYearsRepository.updateAcademicYear(academicYearId, updateAcademicYearDto);
    }

    async deleteAcademicYear(academicYearId: string): Promise<AcademicYear> {
        const deletedAcademicYear = await this.academicYearsRepository.deleteAcademicYear(academicYearId)
        const deleteAcademicYearSagaState = new DeleteAcademicYearSagaState(
            this.classServiceClient,
            deletedAcademicYear
        );
        const deleteAcademicYearSaga = new DeleteAcademicYearSaga();
        await deleteAcademicYearSaga.excute(deleteAcademicYearSagaState);
        return deletedAcademicYear;
    }
}