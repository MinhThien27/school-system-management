import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from "@nestjs/common";
import { SubjectsService } from "./services/subjects.service";
import { CreateSubjectDto } from "./dtos/create-subject.dto";
import { UpdateSubjectDto } from "./dtos/update-subject.dto";
import { Filtering, FilteringParams, Pagination, PaginationParams, Sorting, SortingParams } from "src/decorators";

@Controller({ path: 'subjects', version: '1' })
export class SubjectsController {

    constructor(private readonly subjectsService: SubjectsService) {}

    @Get()
    getSubjects(
        @PaginationParams() pagination: Pagination,
        @SortingParams(['name', 'status']) sorts?: Sorting[],
        @FilteringParams(['name', 'status']) filters?: Filtering[]
    ) {
        return this.subjectsService.getSubjects(pagination, sorts, filters);
    }

    @Post()
    createSubject(@Body(new ValidationPipe({ whitelist: true })) createSubjectDto: CreateSubjectDto) {
        return this.subjectsService.createSubject(createSubjectDto);
    }

    @Patch(':subjectId')
    udpateSubject(
        @Param('subjectId') subjectId: string,
        @Body(new ValidationPipe({ whitelist: true })) updateSubjectDto: UpdateSubjectDto
    ) {
        return this.subjectsService.updateSubject(subjectId, updateSubjectDto);
    }

    @Delete(':subjectId')
    deleteSubject(@Param('subjectId') subjectId: string) {
        return this.subjectsService.deleteSubject(subjectId);
    }

    @Get(':subjectId')
    getSubject(@Param('subjectId') subjectId: string) {
        return this.subjectsService.getSubject(subjectId);
    }
}