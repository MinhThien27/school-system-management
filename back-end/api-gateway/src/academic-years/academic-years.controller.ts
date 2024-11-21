import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from "@nestjs/common";
import { SemestersService } from "./services/semesters.service";
import { Filtering, FilteringParams, Pagination, PaginationParams, Sorting, SortingParams } from "src/decorators";
import { CreateAcademicYearDto } from "./dtos/create-academic-year.dto";
import { AcademicYearsService } from "./services/academic-year.service";
import { UpdateAcademicYearDto } from "./dtos/update-academic-year.dto";
import { CreateSemesterDto } from "./dtos/create-semester.dto";
import { UpdateSemesterDto } from "./dtos/update-semester.dto";

@Controller({ path: 'academic-years', version: '1' })
export class AcademicYearsController {

    constructor(
        private readonly academicYearService: AcademicYearsService,
        private readonly semestersSevice: SemestersService
    ) {}
    
    @Get()
    getAcademicYears(
        @PaginationParams() pagination: Pagination,
        @SortingParams(['name', 'startDate', 'endDate']) sorts?: Sorting[],
        @FilteringParams(['name', 'startDate', 'endDate', 'status']) filters?: Filtering[]
    ) {
        return this.academicYearService.getAcademicYears(pagination, sorts, filters);
    }

    @Post()
    createAcademicYear(
        @Body(new ValidationPipe({ whitelist: true })) createAcademicYearDto: CreateAcademicYearDto
    ) {
        return this.academicYearService.createAcademicYear(createAcademicYearDto);
    }

    @Patch(':academicYearId')
    updateAcademicYear(
        @Param('academicYearId') academicYearId: string,
        @Body(new ValidationPipe({ whitelist: true })) updateAcademicYearDto: UpdateAcademicYearDto
    ) {
        console.log({updateAcademicYearDto})
        return this.academicYearService.updateAcademicYear(academicYearId, updateAcademicYearDto);
    }

    @Delete(':academicYearId')
    deleteAcademicYear(
        @Param('academicYearId') academicYearId: string
    ) {
        return this.academicYearService.deleteAcademicYear(academicYearId);
    }
    
    @Get(':academicYearId')
    getAcademicYear(
        @Param('academicYearId') academicYearId: string
    ) {
        return this.academicYearService.getAcademicYear(academicYearId);
    }

    @Get(':academicYearId/semesters')
    getSemesters(
        @Param('academicYearId') academicYearId: string,
        @PaginationParams() pagination: Pagination,
        @SortingParams(['startDate', 'endDate', 'semesterNumber']) sorts?: Sorting[],
        @FilteringParams(['name', 'startDate', 'endDate', 'semesterNumber', 'status']) filters?: Filtering[]
    ) {
        return this.semestersSevice.getSemesters(academicYearId, pagination, sorts, filters);
    }

    @Post(':academicYearId/semesters')
    createSemester(
        @Param('academicYearId') academicYearId: string,
        @Body(new ValidationPipe({ whitelist: true })) createSemesterDto: CreateSemesterDto
    ) {
        return this.semestersSevice.createSemester(academicYearId, createSemesterDto);
    }

    @Patch(':academicYearId/semesters/:semesterId')
    updateSemester(
        @Param('academicYearId') academicYearId: string,
        @Param('semesterId') semesterId: string,
        @Body(new ValidationPipe({ whitelist: true })) updateSemesterDto: UpdateSemesterDto
    ) {
        return this.semestersSevice.updateSemester(academicYearId, semesterId, updateSemesterDto);
    }
    
    @Delete(':academicYearId/semesters/:semesterId')
    deleteSemester(
        @Param('academicYearId') academicYearId: string,
        @Param('semesterId') semesterId: string
    ) {
        return this.semestersSevice.deleteSemester(academicYearId, semesterId);
    }

    @Get(':academicYearId/semesters/:semesterId')
    getSemester(
        @Param('academicYearId') academicYearId: string,
        @Param('semesterId') semesterId: string
    ) {
        return this.semestersSevice.getSemester(academicYearId, semesterId);
    }
}