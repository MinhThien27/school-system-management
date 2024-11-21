import { Controller, UseFilters } from "@nestjs/common";
import { DepartmentsService } from "./services/departments.service";
import { CreateDepartmentDto } from "./dtos/create-department.dto";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AllExceptionsFilter } from "src/exception-filters";
import { Department } from "./types/department-custom.type";
import { ParseDepartmentPipe } from "./pipes/parse-department.pipe";
import { UpdateDepartmentDto } from "./dtos/update-department.dto";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { CreateDepartmentSubjectDto } from "./dtos/create-department-subject.dto";
import { DepartmentSubjectsService } from "./services/department-subjects.service";
import { CheckDepartmentSubjectPropsExistencePipe } from "./pipes/check-department-subject-props-existence.pipe";
import { CheckDuplicateDepartmentSubjectPipe } from "./pipes/check-duplicate-department-subject.pipe";
import { UpdateDepartmentSubjectDto } from "./dtos/update-department-subject.dto";
import { ParseDepartmentSubjectPipe } from "./pipes/parse-department-subject.pipe";
import { DepartmentSubject } from "./types/department-subject-custom.type";
import { CreateDepartmentTeacherDto } from "./dtos/create-department-teacher.dto";
import { DepartmentTeachersService } from "./services/department-teachers.service";
import { CheckDepartmentTeacherPropsExistencePipe } from "./pipes/check-department-teacher-props-existence.pipe";
import { CheckDuplicateDepartmentTeacherPipe } from "./pipes/check-duplicate-department-teacher.pipe";
import { UpdateDepartmentTeacherDto } from "./dtos/update-department-teacher.dto";
import { ParseDepartmentTeacherPipe } from "./pipes/parse-department-teacher.pipe";
import { DepartmentTeacher } from "./types/department-teacher-custom.type";
import { CheckDepartmentTeacherValidPropsPipe } from "./pipes/check-department-teacher-valid-props.pipe";
import { CheckDepartmentPropsExistencePipe } from "./pipes/check-department-props-existence.pipe";
import { CheckDuplicateDepartmentPipe } from "./pipes/check-duplicate-department.pipe";
import { Prisma } from "@prisma/client";
import { CreateDepartmentSubjectsDto } from "./dtos/create-department-subjects.dto";
import { UpdateDepartmentSubjectsDto } from "./dtos/update-department-subjects.dto";

@Controller()
@UseFilters(AllExceptionsFilter)
export class DepartmentsController {
    
    constructor(
        private readonly departmentsService: DepartmentsService,
        private readonly departmentSubjectsService: DepartmentSubjectsService,
        private readonly departmentTeachersService: DepartmentTeachersService
    ) {}

    @MessagePattern({ cmd: 'get-departments' })
    getDepartments(
        @Payload('pagination') pagination: Pagination,
        @Payload('sorts') sorts?: Sorting[],
        @Payload('filters') filters?: Filtering[]
    ) { 
        return this.departmentsService.getDepartments(pagination, sorts, filters);
    }

    @MessagePattern({ cmd: 'create-department' })
    createDepartment(
        @Payload(
            CheckDepartmentPropsExistencePipe,
            CheckDuplicateDepartmentPipe
        ) payload: any,
        @Payload('dto') createDepartmentDto: CreateDepartmentDto
    ) {
        return this.departmentsService.createDepartment(createDepartmentDto);
    }

    @MessagePattern({ cmd: 'update-department' })
    updateDepartment(
        @Payload(
            CheckDepartmentPropsExistencePipe,
            CheckDuplicateDepartmentPipe
        ) payload: any,
        @Payload('departmentId') departmentId: string,
        @Payload('dto') updateDepartmnetDto: UpdateDepartmentDto,
    ) {
        return this.departmentsService.updateDepartment(departmentId, updateDepartmnetDto);
    }

    @MessagePattern({ cmd: 'delete-department' })
    deleteDepartment(@Payload(ParseDepartmentPipe) department: Department) {
        return this.departmentsService.deleteDepartment(department.id);
    }

    @MessagePattern({ cmd: 'get-department' })
    getDepartment(@Payload(ParseDepartmentPipe) department: Department) {
        return this.departmentsService.getDepartment(department);
    }

    /* Subjects */
    @MessagePattern({ cmd: 'get-department-subjects' })
    getDepartmentSubjects(
        @Payload('departmentId', ParseDepartmentPipe) department: Department,
        @Payload('pagination') pagination: Pagination,
        @Payload('sorts') sorts?: Sorting[],
        @Payload('filters') filters?: Filtering[]
    ) {
        return this,this.departmentSubjectsService.getDepartmentSubjects(department.id, pagination, sorts, filters);
    }

    @MessagePattern({ cmd: 'create-department-subject' })
    createDepartmentSubject(
        @Payload(
            CheckDepartmentSubjectPropsExistencePipe,
            CheckDuplicateDepartmentSubjectPipe
        ) payload: any,
        @Payload('departmentId', ParseDepartmentPipe) department: Department,
        @Payload('dto') createDepartmentSubjectDto: CreateDepartmentSubjectDto 
    ) { 
        return this.departmentSubjectsService.createDepartmentSubject(department.id, createDepartmentSubjectDto);
    }
    
    @MessagePattern({ cmd: 'create-department-subjects' })
    createDepartmentSubjects(
        @Payload(
            CheckDepartmentSubjectPropsExistencePipe,
            CheckDuplicateDepartmentSubjectPipe
        ) payload: any,
        @Payload('departmentId', ParseDepartmentPipe) department: Department,
        @Payload('dto') createDepartmentSubjectsDto: CreateDepartmentSubjectsDto 
    ) { 
        return this.departmentSubjectsService.createDepartmentSubjects(department.id, createDepartmentSubjectsDto);
    }

    @MessagePattern({ cmd: 'update-department-subject' })
    updateDepartmentSubject(
        @Payload(
            CheckDepartmentSubjectPropsExistencePipe,
            CheckDuplicateDepartmentSubjectPipe
        ) payload: any,
        @Payload('departmentId', ParseDepartmentPipe) department: Department,
        @Payload('departmentSubjectId') departmentSubjectId: string,
        @Payload('dto') updateDepartmentSubjectDto: UpdateDepartmentSubjectDto 
    ) { 
        return this.departmentSubjectsService.udpateDepartmentSubject(departmentSubjectId, updateDepartmentSubjectDto);
    }

    @MessagePattern({ cmd: 'update-department-subjects' })
    updateDepartmentSubjects(
        @Payload(
            CheckDepartmentSubjectPropsExistencePipe,
            CheckDuplicateDepartmentSubjectPipe
        ) payload: any,
        @Payload('departmentId', ParseDepartmentPipe) department: Department,
        @Payload('dto') updateDepartmentSubjectsDto: UpdateDepartmentSubjectsDto 
    ) { 
        return this.departmentSubjectsService.udpateDepartmentSubjects(department.id, updateDepartmentSubjectsDto);
    }

    @MessagePattern({ cmd: 'delete-department-subject' })
    deleteDepartmentSubject(
        @Payload('departmentId', ParseDepartmentPipe) department: Department,
        @Payload('departmentSubjectId', ParseDepartmentSubjectPipe) departmentSubject: DepartmentSubject,
    ) { 
        return this.departmentSubjectsService.deleteDepartmentSubject(departmentSubject.id);
    }

    @MessagePattern({ cmd: 'get-department-subject' })
    getDepartmentSubject(
        @Payload('departmentId', ParseDepartmentPipe) department: Department,
        @Payload('departmentSubjectId', ParseDepartmentSubjectPipe) departmentSubject: DepartmentSubject,
    ) { 
        return this.departmentSubjectsService.getDepartmentSubject(departmentSubject);
    }

    @MessagePattern({ cmd: 'delete-department-subjects' })
    deleteDepartmentSubjects(
        @Payload('filterQuery') filterQuery: Prisma.DepartmentSubjectWhereInput
    ) { 
        return this.departmentSubjectsService.deleteDepartmentSubjects(filterQuery);
    }

    /* Teachers */
    @MessagePattern({ cmd: 'get-department-teachers' })
    getDepartmentTeachers(
        @Payload('departmentId', ParseDepartmentPipe) department: Department,
        @Payload('pagination') pagination: Pagination,
        @Payload('sorts') sorts?: Sorting[],
        @Payload('filters') filters?: Filtering[]
    ) {
        return this,this.departmentTeachersService.getDepartmentTeachers(department.id, pagination, sorts, filters);
    }

    @MessagePattern({ cmd: 'create-department-teacher' })
    createDepartmentTeacher(
        @Payload(
            CheckDepartmentTeacherPropsExistencePipe,
            CheckDepartmentTeacherValidPropsPipe,
            CheckDuplicateDepartmentTeacherPipe
        ) payload: any,
        @Payload('departmentId', ParseDepartmentPipe) department: Department,
        @Payload('dto') createDepartmentTeacherDto: CreateDepartmentTeacherDto
    ) {
        return this.departmentTeachersService.createDepartmentTeacher(department.id, createDepartmentTeacherDto);
    }

    @MessagePattern({ cmd: 'update-department-teacher' })
    updateDepartmentTeacher(
        @Payload(
            CheckDepartmentTeacherPropsExistencePipe,
            CheckDepartmentTeacherValidPropsPipe,
            CheckDuplicateDepartmentTeacherPipe
        ) payload: any,
        @Payload('departmentId', ParseDepartmentPipe) department: Department,
        @Payload('departmentTeacherId') departmentTeacherId: string,
        @Payload('dto') updateDepartmentTeacherDto: UpdateDepartmentTeacherDto
    ) {
        return this.departmentTeachersService.updateDepartmentTeacher(departmentTeacherId, updateDepartmentTeacherDto);
    }
    
    @MessagePattern({ cmd: 'delete-department-teacher' })
    deleteDepartmentTeacher(
        @Payload('departmentId', ParseDepartmentPipe) department: Department,
        @Payload('departmentTeacherId', ParseDepartmentTeacherPipe) departmentTeacher: DepartmentTeacher,
    ) {
        return this.departmentTeachersService.deleteDepartmentTeacher(departmentTeacher.id);
    }

    @MessagePattern({ cmd: 'get-department-teacher' })
    getDepartmentTeacher(
        @Payload('departmentId', ParseDepartmentPipe) department: Department,
        @Payload('departmentTeacherId', ParseDepartmentTeacherPipe) departmentTeacher: DepartmentTeacher,
    ) {
        return this.departmentTeachersService.getDepartmentTeacher(departmentTeacher);
    }

    /* Available Teacher Subjects */
    @MessagePattern({ cmd: 'delete-available-teacher-subjects' })
    deleteAvailableTeacherSubjects(
        @Payload('filterQuery') filterQuery: Prisma.AvailableTeacherSubjectWhereInput
    ) {
        return this.departmentTeachersService.deleteAvailableTeacherSubjects(filterQuery);
    }
}