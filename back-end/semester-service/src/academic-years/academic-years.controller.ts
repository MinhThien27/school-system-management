import { Controller, UseFilters } from "@nestjs/common";
import { AllExceptionsFilter } from "src/exception-filters";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { AcademicYearsService } from "./services/academic-years.service";
import { CreateAcademicYearDto } from "./dtos/craete-academic-year.dto";
import { UpdateAcademicYearDto } from "./dtos/update-academic-year.dto";
import { ParseAcademicYearPipe } from "./pipes/parse-academic-year.pipe";
import { AcademicYear } from "./types/academic-year-custom.type";
import { CheckDuplicateAcademicYearPipe } from "./pipes/check-duplicate-academic-year.pipe";
import { CheckAcademicYearValidPropsPipe } from "./pipes/check-academic-year-valid-props.pipe";

@Controller() 
@UseFilters(AllExceptionsFilter)
export class AcademicYearsController {

    constructor(
        private readonly academicYearsService: AcademicYearsService
    ) {}

    @MessagePattern({ cmd: 'get-academic-years' })
    getAcademicYears(
        @Payload('pagination') pagination: Pagination,
        @Payload('sorts') sorts?: Sorting[],
        @Payload('filters') filters?: Filtering[]
    ) {
        return this.academicYearsService.getAcademicYears(pagination, sorts, filters);
    }

    @MessagePattern({ cmd: 'create-academic-year' })
    createAcademicYear(
        @Payload(
            CheckAcademicYearValidPropsPipe,
            CheckDuplicateAcademicYearPipe
        ) payload: any,
        @Payload('dto') createAcademicYearDto: CreateAcademicYearDto
    ) {
        return this.academicYearsService.createAcademicYear(createAcademicYearDto);
    }

    @MessagePattern({ cmd: 'update-academic-year' })
    updateAcademicYear(
        @Payload(
            CheckAcademicYearValidPropsPipe,
            CheckDuplicateAcademicYearPipe
        ) payload: any,
        @Payload('academicYearId') academicYearId: string,
        @Payload('dto') updateAcademicYearDto: UpdateAcademicYearDto
    ) {
        return this.academicYearsService.updateAcademicYear(academicYearId, updateAcademicYearDto);
    }

    @MessagePattern({ cmd: 'delete-academic-year' })
    deleteAcademicYear(@Payload(ParseAcademicYearPipe) academicYear: AcademicYear) {
        return this.academicYearsService.deleteAcademicYear(academicYear.id);
    }

    @MessagePattern({ cmd: 'get-academic-year' })
    getSemester(@Payload(ParseAcademicYearPipe) academicYear: AcademicYear) {
        return academicYear;
    }
}