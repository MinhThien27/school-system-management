import { Body, Controller, Param, Patch, Post, Delete, ValidationPipe, Get, Put } from "@nestjs/common";
import { ClassesService } from "./services/classes.service";
import { CreateClassDto } from "./dtos/create-class.dto";
import { UpdateClassDto } from "./dtos/update-class.dto";
import { Filtering, FilteringParams, Pagination, PaginationParams, Sorting, SortingParams } from "src/decorators";
import { ClassSubjectsService } from "./services/class-subjects.service";
import { CreateClassSubjectDto } from "./dtos/create-class-subject.dto";
import { UpdateClassSubjectDto } from "./dtos/update-class-subject.dto";
import { CreateClassStudentDto } from "./dtos/create-class-student.dto";
import { ClassStudentsService } from "./services/class-students.service";
import { UpdateClassStudentDto } from "./dtos/update-class-student.dto";
import { GradesService } from "./services/grades.service";
import { UpdateGradesDto } from "./dtos/update-grades.dto";

@Controller({ path: 'classes', version: '1' })
export class ClassesController {

    constructor(
        private readonly classesService: ClassesService,
        private readonly classSubjectsService: ClassSubjectsService,
        private readonly classStudentsService: ClassStudentsService,
        private readonly gradesService: GradesService
    ) { }

    @Get()
    getClasses(
        @PaginationParams() pagination?: Pagination,
        @SortingParams(['name', 'code', 'capacity', 'academicYear']) sorts?: Sorting[],
        @FilteringParams(['name', 'code', 'capacity', 'academicYear', 'formTeacherId']) filters?: Filtering[]
    ) {
        return this.classesService.getClasses(pagination, sorts, filters);
    }

    @Post()
    createClass(@Body(new ValidationPipe({ whitelist: true })) createClassDto: CreateClassDto) {
        return this.classesService.createClass(createClassDto);
    }

    @Patch(':classId')
    updateClass(
        @Param('classId') classId: string,
        @Body(new ValidationPipe({ whitelist: true })) updateClassDto: UpdateClassDto
    ) {
        return this.classesService.updateClass(classId, updateClassDto);
    }

    @Delete(':classId')
    deleteClass(@Param('classId') classId: string) {
        return this.classesService.deleteClass(classId);
    }

    @Get(':classId')
    getClass(@Param('classId') classId: string) {
        return this.classesService.getClass(classId);
    }

    /* Students */
    @Get(':classId/students')
    getClassStudents(
        @Param('classId') classId: string,
        @PaginationParams() pagination: Pagination,
        @SortingParams(['classId', 'studentId']) sorts?: Sorting[],
        @FilteringParams(['classId', 'studentId']) filters?: Filtering[]
    ) {
        return this.classStudentsService.getClassStudents(classId, pagination, sorts, filters);
    }

    @Post(':classId/students')
    createClassStudent(
        @Param('classId') classId: string,
        @Body(new ValidationPipe({ whitelist: true })) createClassStudentDto: CreateClassStudentDto
    ) {
        return this.classStudentsService.createClassStudent(classId, createClassStudentDto);
    }

    @Patch(':classId/students/:classStudentId')
    updateClassStudent(
        @Param('classId') classId: string,
        @Param('classStudentId') classStudentId: string,
        @Body(new ValidationPipe({ whitelist: true })) updateClassStudentDto: UpdateClassStudentDto
    ) {
        return this.classStudentsService.updateClassStudent(classId, classStudentId, updateClassStudentDto);
    }

    @Delete(':classId/students/:classStudentId')
    deleteClassStudent(
        @Param('classId') classId: string,
        @Param('classStudentId') classStudentId: string
    ) {
        return this.classStudentsService.deleteClasstudent(classId, classStudentId);
    }

    @Get(':classId/students/:classStudentId')
    getClassStudent(
        @Param('classId') classId: string,
        @Param('classStudentId') classStudentId: string
    ) {
        return this.classStudentsService.getClasstudent(classId, classStudentId);
    }

    /* Subjects */
    @Get(':classId/subjects')
    getClassSubjects(
        @Param('classId') classId: string,
        @PaginationParams() pagination: Pagination,
        @SortingParams(['startDate', 'endDate']) sorts?: Sorting[],
        @FilteringParams(['startDate', 'endDate', 'subjectId', 'semesterId']) filters?: Filtering[]
    ) {
        return this.classSubjectsService.getClassSubjects(classId, pagination, sorts, filters);
    }

    @Post(':classId/subjects')
    createClassSubject(
        @Param('classId') classId: string,
        @Body(new ValidationPipe({ whitelist: true })) createClassSubjectDto: CreateClassSubjectDto
    ) {
        return this.classSubjectsService.createClassSubject(classId, createClassSubjectDto);
    }

    @Patch(':classId/subjects/:classSubjectId')
    updateClassSubject(
        @Param('classId') classId: string,
        @Param('classSubjectId') classSubjectId: string,
        @Body(new ValidationPipe({ whitelist: true })) updateClassSubjectDto: UpdateClassSubjectDto
    ) {
        return this.classSubjectsService.updateClassSubject(classId, classSubjectId, updateClassSubjectDto);
    }

    @Delete(':classId/subjects/:classSubjectId')
    deleteClassSubject(
        @Param('classId') classId: string,
        @Param('classSubjectId') classSubjectId: string
    ) {
        return this.classSubjectsService.deleteClassSubject(classId, classSubjectId);
    }

    @Get(':classId/subjects/:classSubjectId')
    getClassSubject(
        @Param('classId') classId: string,
        @Param('classSubjectId') classSubjectId: string
    ) {
        return this.classSubjectsService.getClassSubject(classId, classSubjectId);
    }

    /* Grades of Class Subject */
    /* Subjects */
    @Get(':classId/subjects/:classSubjectId/grades')
    getGradesOfClassSubject(
        @Param('classId') classId: string,
        @Param('classSubjectId') classSubjectId: string, 
        @PaginationParams() pagination: Pagination,
        @SortingParams() sorts?: Sorting[],
        @FilteringParams() filters?: Filtering[]
    ) {
        return this.gradesService.getGradesOfClassSubject(classId, classSubjectId, pagination, sorts, filters);
    }

    @Put(':classId/subjects/:classSubjectId/grades')
    updateGradesOfClassSubject(
        @Param('classId') classId: string,
        @Param('classSubjectId') classSubjectId: string,
        @Body(new ValidationPipe({ whitelist: true })) updateGradesDto: UpdateGradesDto
    ) {
        return this.gradesService.updateGradesOfClassSubject(classId, classSubjectId, updateGradesDto);
    }
}