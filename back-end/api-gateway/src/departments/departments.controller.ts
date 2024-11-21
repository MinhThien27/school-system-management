import { Body, Controller, Delete, Get, Param, Patch, Post, Put, ValidationPipe } from "@nestjs/common";
import { DepartmentsService } from "./services/departments.service";
import { UpdateDepartmentDto } from "./dtos/update-department.dto";
import { Filtering, FilteringParams, Pagination, PaginationParams, Sorting, SortingParams } from "src/decorators";
import { DepartmentSubjectsService } from "./services/department-subjects.service";
import { UpdateDepartmentSubjectDto } from "./dtos/update-department-subject.dto";
import { CreateDepartmentTeacherDto } from "./dtos/create-department-teacher.dto";
import { DepartmentTeachersService } from "./services/department-teachers.service";
import { UpdateDepartmentTeacherDto } from "./dtos/update-department-teacher.dto";
import { CreateDepartmentDto } from "./dtos/create-department.dto";
import { CreateDepartmentSubjectsDto } from "./dtos/create-department-subjects.dto";
import { UpdateDepartmentSubjectsDto } from "./dtos/update-department-subjects.dto";

@Controller({ path: 'departments', version: '1' })
export class DepartmentsController {

    constructor(
        private readonly departmentsService: DepartmentsService,
        private readonly departmentSubjectsService: DepartmentSubjectsService,
        private readonly departmentTeachersService: DepartmentTeachersService
    ) {}

    @Get()
    getDepartments(
        @PaginationParams() pagination: Pagination,
        @SortingParams(['name']) sorts?: Sorting[],
        @FilteringParams(['name']) filters?: Filtering[]
    ) {
        return this.departmentsService.getDepartments(pagination, sorts, filters);
    }

    @Post()
    createDepartment(
        @Body(new ValidationPipe({ whitelist: true })) createDepartmentDto: CreateDepartmentDto
    ) {
        return this.departmentsService.createDepartment(createDepartmentDto);
    }

    @Patch(':departmentId')
    updateDepartment(
        @Param('departmentId') departmentId: string,
        @Body(new ValidationPipe({ whitelist: true })) updateDepartmentDto: UpdateDepartmentDto
    ) {
        return this.departmentsService.updateDepartment(departmentId, updateDepartmentDto);
    }
    
    @Delete(':departmentId')
    deleteDepartment(@Param('departmentId') departmentId: string) {
        return this.departmentsService.deleteDepartment(departmentId);
    }

    @Get(':departmentId')
    getDepartment(@Param('departmentId') departmentId: string) {
        return this.departmentsService.getDepartment(departmentId);
    }

    /* Subjects */
    @Get(':departmentId/subjects')
    getDepartmentSubjects(
        @Param('departmentId') departmentId: string,
        @PaginationParams() pagination: Pagination,
        @SortingParams(['subjectId']) sorts?: Sorting[],
        @FilteringParams(['subjectId']) filters?: Filtering[]
    ) {
        return this.departmentSubjectsService.getDepartmentSubjects(departmentId, pagination, sorts, filters);
    }

    // @Post(':departmentId/subjects')
    // createDepartmentSubject(
    //     @Param('departmentId') departmentId: string,
    //     @Body(new ValidationPipe({ whitelist: true })) createDepartmentSubjectDto: CreateDepartmentSubjectDto
    // ) {
    //     return this.departmentSubjectsService.createDepartmentSubject(departmentId, createDepartmentSubjectDto);
    // }

    @Post(':departmentId/subjects')
    createDepartmentSubjects(
        @Param('departmentId') departmentId: string,
        @Body(new ValidationPipe({ whitelist: true })) createDepartmentSubjectsDto: CreateDepartmentSubjectsDto
    ) {
        return this.departmentSubjectsService.createDepartmentSubjects(departmentId, createDepartmentSubjectsDto);
    }

    @Put(':departmentId/subjects')
    updateDepartmentSubjects(
        @Param('departmentId') departmentId: string,
        @Body(new ValidationPipe({ whitelist: true })) updateDepartmentSubjectsDto: UpdateDepartmentSubjectsDto
    ) {
        return this.departmentSubjectsService.updateDepartmentSubjects(departmentId, updateDepartmentSubjectsDto);
    }

    @Patch(':departmentId/subjects/:departmentSubjectId')
    updateDepartmentSubject(
        @Param('departmentId') departmentId: string,
        @Param('departmentSubjectId') departmentSubjectId: string,
        @Body(new ValidationPipe({ whitelist: true })) updateDepartmentSubjectDto: UpdateDepartmentSubjectDto
    ) {
        return this.departmentSubjectsService.updateDepartmentSubject(departmentId, departmentSubjectId, updateDepartmentSubjectDto);
    }

    @Delete(':departmentId/subjects/:departmentSubjectId')
    deleteDepartmentSubject(
        @Param('departmentId') departmentId: string,
        @Param('departmentSubjectId') departmentSubjectId: string
    ) {
        return this.departmentSubjectsService.deleteDepartmentSubject(departmentId, departmentSubjectId);
    }

    @Get(':departmentId/subjects/:departmentSubjectId')
    getDepartmentSubject(
        @Param('departmentId') departmentId: string,
        @Param('departmentSubjectId') departmentSubjectId: string
    ) {
        return this.departmentSubjectsService.getDepartmentSubject(departmentId, departmentSubjectId);
    }

    /* Teachers */
    @Get(':departmentId/teachers')
    getDepartmentTeachers(
        @Param('departmentId') departmentId: string,
        @PaginationParams() pagination: Pagination,
        @SortingParams(['teacherId']) sorts?: Sorting[],
        @FilteringParams(['teacherId']) filters?: Filtering[]
    ) {
        return this.departmentTeachersService.getDepartmentTeachers(departmentId, pagination, sorts, filters);
    }


    @Post(':departmentId/teachers')
    createDepartmentTeacher(
        @Param('departmentId') departmentId: string,
        @Body(new ValidationPipe({ whitelist: true })) createDepartmentTeacherDto: CreateDepartmentTeacherDto
    ) {
        return this.departmentTeachersService.createDepartmentTeacher(departmentId, createDepartmentTeacherDto);
    }

    @Patch(':departmentId/teachers/:departmentTeacherId')
    updateDepartmentTeacher(
        @Param('departmentId') departmentId: string,
        @Param('departmentTeacherId') departmentTeacherId: string,
        @Body(new ValidationPipe({ whitelist: true })) updateDepartmentTeacherDto: UpdateDepartmentTeacherDto
    ) {
        return this.departmentTeachersService.updateDepartmentTeacher(departmentId, departmentTeacherId, updateDepartmentTeacherDto);
    }

    @Delete(':departmentId/teachers/:departmentTeacherId')
    deleteDepartmentTeacher(
        @Param('departmentId') departmentId: string,
        @Param('departmentTeacherId') departmentTeacherId: string
    ) { 
        return this.departmentTeachersService.deleteDepartmentTeacher(departmentId, departmentTeacherId);
    }

    @Get(':departmentId/teachers/:departmentTeacherId')
    getDepartmentTeacher(
        @Param('departmentId') departmentId: string,
        @Param('departmentTeacherId') departmentTeacherId: string
    ) { 
        return this.departmentTeachersService.getDepartmentTeacher(departmentId, departmentTeacherId);
    }
}