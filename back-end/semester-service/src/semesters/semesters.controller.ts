import { Controller, UseFilters } from "@nestjs/common";
import { AllExceptionsFilter } from "src/exception-filters";
import { SemestersService } from "./services/semesters.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateSemesterDto } from "./dtos/create-semester.dto";
import { UpdateSemesterDto } from "./dtos/update-semester.dto";
import { ParseSemesterPipe } from "./pipes/parse-semester.pipe";
import { Semester } from "./types/semester-custom.type";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { ParseAcademicYearPipe } from "src/academic-years/pipes/parse-academic-year.pipe";
import { AcademicYear } from "src/academic-years/types/academic-year-custom.type";
import { CheckDuplicateSemesterPipe } from "./pipes/check-duplicate-semester.pipe";
import { CheckSemesterValidPropsPipe } from "./pipes/check-semester-valid-props.pipe";
import { Prisma } from "@prisma/client";

@Controller() 
@UseFilters(AllExceptionsFilter)
export class SemestersController {

    constructor(private readonly semestersService: SemestersService) {}

    @MessagePattern({ cmd: 'count-semesters' })
    countSemesters(
        @Payload('academicYearId', ParseAcademicYearPipe) academicYear: AcademicYear
    ) {
        return this.semestersService.countSemesters(academicYear.id);
    }

    @MessagePattern({ cmd: 'get-semesters' })
    getSemesters(
        @Payload('academicYearId', ParseAcademicYearPipe) academicYear: AcademicYear,
        @Payload('pagination') pagination: Pagination,
        @Payload('sorts') sorts?: Sorting[],
        @Payload('filters') filters?: Filtering[]
    ) {
        return this.semestersService.getSemesters(academicYear.id, pagination, sorts, filters);
    }
    
    @MessagePattern({ cmd: 'get-semesters-with-filter-query' })
    getSemestersWithFilterQuery(
        @Payload('filterQuery') filterQuery: Prisma.SemesterWhereInput
    ) {
        return this.semestersService.getSemestersWithFilterQuery(filterQuery);
    }

    @MessagePattern({ cmd: 'create-semester' })
    createSemester(
        @Payload(
            CheckSemesterValidPropsPipe,
            CheckDuplicateSemesterPipe
        ) payload: any,
        @Payload('academicYearId', ParseAcademicYearPipe) academicYear: AcademicYear,
        @Payload('dto') createSemesterDto: CreateSemesterDto
    ) {
        return this.semestersService.createSemester(academicYear, createSemesterDto);
    }

    @MessagePattern({ cmd: 'update-semester' })
    updateSemester(
        @Payload(
            CheckSemesterValidPropsPipe,
            CheckDuplicateSemesterPipe
        ) payload: any,
        @Payload('academicYearId', ParseAcademicYearPipe) academicYear: AcademicYear,
        @Payload('semesterId') semesterId: string,
        @Payload('dto') updateSemesterDto: UpdateSemesterDto
    ) {
        return this.semestersService.updateSemester(semesterId, updateSemesterDto);
    }

    @MessagePattern({ cmd: 'delete-semester' })
    deleteSemester(
        @Payload('academicYearId', ParseAcademicYearPipe) academicYear: AcademicYear,
        @Payload('semesterId', ParseSemesterPipe) semester: Semester
    ) {
        return this.semestersService.deleteSemester(academicYear.id, semester);
    }

    @MessagePattern({ cmd: 'get-semester' })
    getSemester(
        @Payload('academicYearId', ParseAcademicYearPipe) academicYear: AcademicYear,
        @Payload('semesterId', ParseSemesterPipe) semester: Semester
    ) {
        return semester;
    }

    @MessagePattern({ cmd: 'get-semester-without-academic-year-id' })
    getSemesterWithoutAcademicYearId(
        @Payload(ParseSemesterPipe) semester: Semester
    ) {
        return semester;
    }
}