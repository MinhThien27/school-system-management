import { Controller, UseFilters } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateTeacherDto } from "./dtos/create-teacher.dto";
import { TeachersService } from "./services/teachers.service";
import { UpdateTeacherImageUrlDto } from "./dtos/update-teacher-image-url.dto";
import { TeacherSagaService } from "./services/teacher-saga.service";
import { UpdateTeacherDto } from "./dtos/update-teacher.dto";
import { Prisma, Teacher } from "@prisma/client";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { AllExceptionsFilter } from "src/exception-filters";
import { ParseTeacherPipe } from "./pipes/parse-teacher.pipe";
import { CheckTeacherClassSubjectPropsExistencePipe } from "./pipes/check-teacher-class-subject-props-existence.pipe";
import { CheckDuplicateTeacherClassSubjectPipe } from "./pipes/check-duplicate-teacher-class-subject.pipe";
import { TeacherClassSubjectsService } from "./services/teacher-class-subjects.service";
import { CreateTeacherClassSubjectDto } from "./dtos/create-teacher-class-subject.dto";
import { UpdateTeacherClassSubjectDto } from "./dtos/update-teacher-class-subject.dto";
import { ParseTeacherClassSubjectPipe } from "./pipes/parse-teacher-class-subject.pipe";
import { TeacherClassSubject } from "./types/teacher-class-subject-custom.type";
import { CheckDuplicateTeacherPipe } from "./pipes/check-duplicate-teacher.pipe";
import { SelectOption } from "src/interfaces/select-options.interfacte";
import { AvailableTeacherSubjectsSevrice } from "./services/available-teacher-subjects.service";

@Controller()
@UseFilters(AllExceptionsFilter)
export class TeachersController {

    constructor(
        private readonly teachersService: TeachersService,
        private readonly teacherSagaService: TeacherSagaService,
        private readonly teacherClassSubjectsSevice: TeacherClassSubjectsService,
        private readonly availableTeacherSubjectsService: AvailableTeacherSubjectsSevrice
    ) {}

    @MessagePattern({ cmd: 'get-teachers' })
    getTeachers(
        @Payload('pagination') pagination: Pagination,
        @Payload('sorts') sorts?: Sorting[],
        @Payload('filters') filters?: Filtering[]
    ) {
        return this.teachersService.getTeachers(pagination, sorts, filters);
    }

    @MessagePattern({ cmd: 'create-teacher' })
    createTeacher(
        @Payload(CheckDuplicateTeacherPipe) payload: any,
        @Payload('dto') createTeacherDto: CreateTeacherDto, 
        @Payload('image') image: Express.Multer.File
    ) {
        return this.teachersService.createTeacher(createTeacherDto, image);
    }

    @MessagePattern({ cmd: 'update-teacher' })
    updateTeacher(
        @Payload(CheckDuplicateTeacherPipe) payload: any,
        @Payload('teacherId') teacherId: string,
        @Payload('dto') updateTeacherDto: UpdateTeacherDto,
        @Payload('image') image?: Express.Multer.File 
    ) {
        return this.teachersService.updateTeacher(teacherId, updateTeacherDto, image);
    }

    @MessagePattern({ cmd: 'delete-teacher' })
    deleteTeacher(
        @Payload(ParseTeacherPipe) teacher: Teacher
    ) {
        return this.teachersService.deleteTeacher(teacher.id);
    }

    @MessagePattern({ cmd: 'get-teacher' })
    getTeacher(
        @Payload(ParseTeacherPipe) teacher: Teacher
    ) {
        return this.teachersService.getTeacher(teacher.id);
    }

    /* Class Subjects */
    @MessagePattern({ cmd: 'get-teacher-class-subjects' })
    getTeacherClassSubjects(
        @Payload('teacherId', ParseTeacherPipe) teacher: Teacher,
        @Payload('pagination') pagination: Pagination,
        @Payload('sorts') sorts?: Sorting[],
        @Payload('filters') filters?: Filtering[]
    ) {
        return this.teacherClassSubjectsSevice.getTeacherClassSubjects(teacher.id, pagination, sorts, filters);
    }

    @MessagePattern({ cmd: 'get-teacher-class-subjects-with-filter-query' })
    getTeacherClassSubjectsWithFilterQuery(
        @Payload('filterQuery') filterQuery: Prisma.TeacherClassSubjectWhereInput,
        @Payload('selectOption') selectOption?: SelectOption
    ) {
        return this.teacherClassSubjectsSevice.getTeacherClassSubjectsWithFilterQuery(filterQuery, selectOption);
    }

    @MessagePattern({ cmd: 'create-teacher-class-subject' })
    createTeacherClassSubject(
        @Payload(
            CheckTeacherClassSubjectPropsExistencePipe,
            CheckDuplicateTeacherClassSubjectPipe
        ) payload: any,
        @Payload('teacherId', ParseTeacherPipe) teacher: Teacher,
        @Payload('dto') createTeacherClassSubjectDto: CreateTeacherClassSubjectDto
    ) {
        return this.teacherClassSubjectsSevice.createTeacherClassSubject(teacher.id, createTeacherClassSubjectDto);
    }

    @MessagePattern({ cmd: 'update-teacher-class-subject' })
    updateTeacherClassSubject(
        @Payload(
            CheckTeacherClassSubjectPropsExistencePipe,
            CheckDuplicateTeacherClassSubjectPipe
        ) payload: any,
        @Payload('teacherId', ParseTeacherPipe) teacher: Teacher,
        @Payload('teacherClassSubjectId') teacherClassSubjectId: string,
        @Payload('dto') updateTeacherClassSubjectDto: UpdateTeacherClassSubjectDto
    ) {
        return this.teacherClassSubjectsSevice.updateTeacherClassSubject(teacher.id, teacherClassSubjectId, updateTeacherClassSubjectDto);
    }

    @MessagePattern({ cmd: 'delete-teacher-class-subject' })
    deleteTeacherClassSubject(
        @Payload('teacherId', ParseTeacherPipe) teacher: Teacher,
        @Payload('teacherClassSubjectId', ParseTeacherClassSubjectPipe) teacherClassSubject: TeacherClassSubject
    ) {
        return this.teacherClassSubjectsSevice.deleteTeacherClassSubject(teacherClassSubject.id);
    }

    @MessagePattern({ cmd: 'get-teacher-class-subject' })
    getTeacherClassSubject(
        @Payload('teacherId', ParseTeacherPipe) teacher: Teacher,
        @Payload('teacherClassSubjectId', ParseTeacherClassSubjectPipe) teacherClassSubject: TeacherClassSubject
    ) {
        return this.teacherClassSubjectsSevice.getTeacherClassSubject(teacherClassSubject);
    }

    @MessagePattern({ cmd: 'delete-teacher-class-subjects' })
    deleteTeacherClassSubjects(
        @Payload('filterQuery') filterQuery: Prisma.TeacherClassSubjectWhereInput
    ) {
        return this.teacherClassSubjectsSevice.deleteTeacherClassSubjects(filterQuery);
    }

    /* Available Teacher Subjects */
    @MessagePattern({ cmd: 'get-available-teacher-subjects' })
    getAvailableTeacherSubjects(
        @Payload('teacherId', ParseTeacherPipe) teacher: Teacher,
        @Payload('pagination') pagination: Pagination,
        @Payload('sorts') sorts?: Sorting[],
        @Payload('filters') filters?: Filtering[]
    ) {
        return this.availableTeacherSubjectsService.getAvailableTeacherSubjects(teacher.id, pagination, sorts, filters);
    }

    @MessagePattern({ cmd: 'get-available-teacher-subjects-with-filter-query' })
    getAvailableTeacherSubjectsWithFilterQuery(
        @Payload('filterQuery') filterQuery: Prisma.AvailableTeacherSubjectWhereInput
    ) {
        return this.availableTeacherSubjectsService.getAvailableTeacherSubjectsWithFilterQuery(filterQuery);
    }
    // -------------------------------------------//



    // -------------------------------------------//
    @MessagePattern({ cmd: 'cancel-create-teacher' })
    cancelCreateTeacher(@Payload() teacherId: string) {
        return this.teacherSagaService.cancelCreateTeacher(teacherId);
    }

    @MessagePattern({ cmd: 'update-teacher-image-url' })
    updateTeacherImageUrl(@Payload() updateTeacherImageUrlDto: UpdateTeacherImageUrlDto) {
        return this.teacherSagaService.updateTeacherImageUrl(updateTeacherImageUrlDto);
    }

    @MessagePattern({ cmd: 'cancel-update-teacher' })
    cancelUpdateTeacher(@Payload() teacher: Teacher) {
        return this.teacherSagaService.cancelUpdateTeacher(teacher);
    }

    @MessagePattern({ cmd: 'cancel-delete-teacher' })
    cancelDeleteTeacher(@Payload() teacher: Teacher) { 
        return this.teacherSagaService.cancelDeleteTeacher(teacher);
    }
}