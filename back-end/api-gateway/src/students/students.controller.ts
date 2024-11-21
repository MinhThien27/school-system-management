import { Body, Controller, Delete, Get, HttpStatus, Param, ParseFilePipeBuilder, Patch, Post, UploadedFile, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { StudentsService } from "./services/students.service";
import { CreateStudentDto } from "./dtos/create-student.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ParseJsonPipe } from "src/pipes";
import { UpdateStudentDto } from "./dtos/update-student.dto";
import { Filtering, FilteringParams, Pagination, PaginationParams, Sorting, SortingParams } from "src/decorators";
import { CreateStudentDetailDto } from "./dtos/create-student-detail.dto";
import { StudentDetailService } from "./services/student-detail.service";
import { UpdateStudentDetailDto } from "./dtos/update-student-detail.dto";
import { CreateParentDto } from "./dtos/create-parent.dto";
import { ParentsService } from "./services/parents.service";
import { UpdateParentDto } from "./dtos/update-parent.dto";
import { GradesService } from "./services/grades.service";
import { UpdateGradeDto } from "./dtos/update-grade.dto";

@Controller({ path: 'students', version: '1' })
export class StudentsController {

    constructor(
        private readonly studentsService: StudentsService,
        private readonly studentDetailService: StudentDetailService,
        private readonly parentsService: ParentsService,
        private readonly gradesService: GradesService
    ) {}

    @Get()
    getStudents(
        @PaginationParams() pagination: Pagination,
        @SortingParams(['firstName', 'lastName', 'enrollmenDate', 'academicYearId']) sorts?: Sorting[],
        @FilteringParams(['id', 'firstName', 'lastName', 'academicYearId']) filters?: Filtering[]
    ) {
        return this.studentsService.getStudents(pagination, sorts, filters);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    createStudent(
        @Body(
            new ParseJsonPipe({ notParseProps: ['citizenIdentification', 'phoneNumber'] }),
            new ValidationPipe({ whitelist: true })
        ) createStudentDto: CreateStudentDto,
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
        return this.studentsService.createStudent(createStudentDto, image);
    }

    @Patch(':studentId')
    @UseInterceptors(FileInterceptor('image'))
    updateStudent(
        @Param('studentId') studentId: string,
        @Body(
            new ParseJsonPipe({ notParseProps: ['citizenIdentification', 'phoneNumber'] }),
            new ValidationPipe({ whitelist: true })
        ) updateStudentDto: UpdateStudentDto,
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
        return this.studentsService.updateStudent(studentId, updateStudentDto, image);
    }

    @Delete(':studentId')
    deleteStudent(@Param('studentId') studentId: string) {
        return this.studentsService.deleteStudent(studentId);
    }

    @Get(':studentId')
    getStudent(@Param('studentId') studentId: string) {
        return this.studentsService.getStudent(studentId);
    }

    /* Student Details */
    @Get(':studentId/student-details')
    getStudentDetail(@Param('studentId') studentId: string) {
        return this.studentDetailService.getStudentDetail(studentId);
    }

    @Post(':studentId/student-details')
    createStudentDetail(
        @Param('studentId') studentId: string,
        @Body(new ValidationPipe({ whitelist: true })) createStudentDetailDto: CreateStudentDetailDto
    ) {
        return this.studentDetailService.createStudentDetail(studentId, createStudentDetailDto);
    }

    @Patch(':studentId/student-details/:studentDetailId')
    updateStudentDetail(
        @Param('studentId') studentId: string,
        @Param('studentDetailId') studentDetailId: string,
        @Body(new ValidationPipe({ whitelist: true })) updateStudentDetailDto: UpdateStudentDetailDto
    ) {
        return this.studentDetailService.updateStudentDetail(studentId, studentDetailId, updateStudentDetailDto);
    }

    @Delete(':studentId/student-details/:studentDetailId')
    deleteStudentDetail(
        @Param('studentId') studentId: string,
        @Param('studentDetailId') studentDetailId: string
    ) {
        return this.studentDetailService.deleteStudentDetail(studentId, studentDetailId);
    }

    /* Parents */
    @Get(':studentId/parents')
    getParents(
        @Param('studentId') studentId: string,
        @PaginationParams() pagination: Pagination,
        @SortingParams(['firstName', 'lastName']) sorts?: Sorting[],
        @FilteringParams(['firstName', 'lastName', 'phoneNumber']) filters?: Filtering[]
    ) { 
        return this.parentsService.getParents(studentId, pagination, sorts, filters);
    }

    @Post(':studentId/parents')
    createParent(
        @Param('studentId') studentId: string,
        @Body(new ValidationPipe({ whitelist: true })) createParentDto: CreateParentDto
    ) {
        return this.parentsService.createParent(studentId, createParentDto);
    }

    @Patch(':studentId/parents/:parentId')
    updateParent(
        @Param('studentId') studentId: string,
        @Param('parentId') parentId: string,
        @Body(new ValidationPipe({ whitelist: true })) updapteParentDto: UpdateParentDto
    ) {
        return this.parentsService.updateParent(studentId, parentId, updapteParentDto);
    }

    @Delete(':studentId/parents/:parentId')
    deleteParent(
        @Param('studentId') studentId: string,
        @Param('parentId') parentId: string
    ) {
        return this.parentsService.deleteParent(studentId, parentId);
    }

    @Get(':studentId/parents/:parentId')
    getParent(
        @Param('studentId') studentId: string,
        @Param('parentId') parentId: string
    ) {
        return this.parentsService.getParent(studentId, parentId);
    }

    /* Grades */
    @Get(':studentId/grades')
    getGrades(
        @Param('studentId') studentId: string,
        @PaginationParams() pagination: Pagination,
        @SortingParams(['oralTest', 'smallTest', 'bigTest', 'midtermExam', 'finalExam', 'subjectAverage', 'classSubjectId', 'studentId']) sorts?: Sorting[],
        @FilteringParams(['oralTest', 'smallTest', 'bigTest', 'midtermExam', 'finalExam', 'subjectAverage', 'classSubjectId', 'studentId']) filters?: Filtering[]
    ) {
        return this.gradesService.getGrades(studentId, pagination, sorts, filters);
    }

    @Patch(':studentId/grades/:gradeId')
    updateGrade(
        @Param('studentId') studentId: string,
        @Param('gradeId') gradeId: string,
        @Body(new ValidationPipe({ whitelist: true })) updateGradeDto: UpdateGradeDto
    ) {
        return this.gradesService.updateGrade(studentId, gradeId, updateGradeDto);
    }

    @Get(':studentId/grades/:gradeId')
    getGrade(
        @Param('studentId') studentId: string,
        @Param('gradeId') gradeId: string
    ) {
        return this.gradesService.getGrade(studentId, gradeId);
    }
}