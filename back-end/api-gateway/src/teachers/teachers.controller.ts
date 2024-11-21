import { Body, Controller, Delete, Get, HttpStatus, Param, ParseFilePipeBuilder, Patch, Post, UploadedFile, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { TeachersService } from "./services/teachers.service";
import { Filtering, FilteringParams, Pagination, PaginationParams, Sorting, SortingParams } from "src/decorators";
import { FileInterceptor } from "@nestjs/platform-express";
import { ParseJsonPipe } from "src/pipes";
import { CreateTeacherDto } from "./dtos/create-teacher.dto";
import { UpdateTeacherDto } from "./dtos/update-teacher.dto";
import { CreateTeacherClassSubjectDto } from "./dtos/create-teacher-class-subject.dto";
import { TeacherClassSubjectsService } from "./services/teacher-class-subjects.service";
import { UpdateTeacherClassSubjectDto } from "./dtos/update-teacher-class-subject.dto";
import { AvailableTeacherSubjectsService } from "./services/available-teacher-subjects.service";

@Controller({ path: 'teachers', version: '1' })
export class TeachersController {

    constructor(
        private readonly teachersService: TeachersService,
        private readonly teacherClassSubjectsService: TeacherClassSubjectsService,
        private readonly availableTeacherSubjectsService: AvailableTeacherSubjectsService
    ) {}

    @Get()
    getTeachers(
        @PaginationParams() pagination: Pagination,
        @SortingParams(['firstName', 'lastName', 'startDate']) sorts?: Sorting[],
        @FilteringParams(['id', 'firstName', 'lastName']) filters?: Filtering[]
    ) {
        return this.teachersService.getTeachers(pagination, sorts, filters);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    createTeacher(
        @Body(
            new ParseJsonPipe({ notParseProps: ['citizenIdentification', 'phoneNumber'] }),
            new ValidationPipe({ whitelist: true })
        ) createTeacherDto: CreateTeacherDto,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({ fileType: new RegExp("(jpeg|jpg|png)") })
                .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
                .build({
                    fileIsRequired: true,
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
                })
        ) image: Express.Multer.File
    ) {
        return this.teachersService.createTeacher(createTeacherDto, image);
    }

    @Patch(':teacherId')
    @UseInterceptors(FileInterceptor('image'))
    updateTeacher(
        @Param('teacherId') teacherId: string,
        @Body(
            new ParseJsonPipe({ notParseProps: ['citizenIdentification', 'phoneNumber'] }),
            new ValidationPipe({ whitelist: true })
        ) updateTeacherDto: UpdateTeacherDto,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({ fileType: new RegExp("(jpeg|jpg|png)") })
                .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
                .build({
                    fileIsRequired: false,
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
                })
        ) image?: Express.Multer.File
    ) {
        return this.teachersService.updateTeacher(teacherId, updateTeacherDto, image);
    }

    @Delete(':teacherId')
    deleteTeacher(@Param('teacherId') teacherId: string) {
        return this.teachersService.deleteTeacher(teacherId);
    }

    @Get(':teacherId')
    getTeacher(@Param('teacherId') teacherId: string) {
        return this.teachersService.getTeacher(teacherId);
    }

    /* Class Subjects */
    @Get(':teacherId/class-subjects')
    getTeacherClassSubjects(
        @Param('teacherId') teacherId: string,
        @PaginationParams() pagination: Pagination,
        @SortingParams() sorts?: Sorting[],
        @FilteringParams() filters?: Filtering[]
    ) {
        return this.teacherClassSubjectsService.getTeacherClassSubjects(teacherId, pagination, sorts, filters);
    }

    @Post(':teacherId/class-subjects')
    createTeacherClassSubject(
        @Param('teacherId') teacherId: string,
        @Body(new ValidationPipe({ whitelist: true })) createTeacherClassSubjectDto: CreateTeacherClassSubjectDto
    ) { 
        return this.teacherClassSubjectsService.createTeacherClassSubject(teacherId, createTeacherClassSubjectDto);
    }

    @Patch(':teacherId/class-subjects/:teacherClassSubjectId')
    updateTeacherClassSubject(
        @Param('teacherId') teacherId: string,
        @Param('teacherClassSubjectId') teacherClassSubjectId: string,
        @Body(new ValidationPipe({ whitelist: true })) updateTeacherCLassSubjectDto: UpdateTeacherClassSubjectDto
    ) {
        return this.teacherClassSubjectsService.updateTeacherClassSubject(teacherId, teacherClassSubjectId, updateTeacherCLassSubjectDto);
    }

    @Delete(':teacherId/class-subjects/:teacherClassSubjectId')
    deleteTeacherClassSubject(
        @Param('teacherId') teacherId: string,
        @Param('teacherClassSubjectId') teacherClassSubjectId: string
    ) {
        return this.teacherClassSubjectsService.deleteTeacherClassSubject(teacherId, teacherClassSubjectId);
    }

    @Get(':teacherId/class-subjects/:teacherClassSubjectId')
    getTeacherClassSubject(
        @Param('teacherId') teacherId: string,
        @Param('teacherClassSubjectId') teacherClassSubjectId: string
    ) {
        return this.teacherClassSubjectsService.getTeacherClassSubject(teacherId, teacherClassSubjectId);
    }

    /* Available Teacher Subjects */
    @Get(':teacherId/available-subjects')
    getAvailableTeacherSubjects(
        @Param('teacherId') teacherId: string,
        @PaginationParams() pagination: Pagination,
        @SortingParams() sorts?: Sorting[],
        @FilteringParams(['subjectId']) filters?: Filtering[]
    ) {
        return this.availableTeacherSubjectsService.getAvailableTeacherSubjects(teacherId, pagination, sorts, filters);
    }
}