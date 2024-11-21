import { Controller, UseFilters } from "@nestjs/common";
import { ClassesService } from "./services/classes.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateClassDto } from "./dtos/create-class.dto";
import { AllExceptionsFilter } from "src/exception-filters";
import { UpdateClassDto } from "./dtos/update-class.dto";
import { Class } from "./types/class-custom.type";
import { ParseClassPipe } from "./pipes/parse-class.pipe";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { CreateclassSubjectDto } from "./dtos/create-class-subject.dto";
import { ClassSubjectsService } from "./services/class-subjects.service";
import { CheckClassSubjectPropsExistencePipe } from "./pipes/check-class-subject-props-existence.pipe";
import { CheckClassSubjectValidPropsPipe } from "./pipes/check-class-subject-valid-props.pipe";
import { CheckDuplicateClassSubjectPipe } from "./pipes/check-duplicate-class-subject.pipe";
import { UpdateClassSubjectDto } from "./dtos/update-class-subject.dto";
import { ParseClassSubjectPipe } from "./pipes/parse-class-subject.pipe";
import { ClassSubject } from "./types/class-subject-custom.type";
import { ClassStudentsService } from "./services/class-students.service";
import { CreateClassStudentDto } from "./dtos/create-class-student.dto";
import { CheckClassStudentPropsExistencePipe } from "./pipes/check-class-student-props-existence.pipe";
import { CheckDuplicateClassStudentPipe } from "./pipes/check-duplicate-class-student.pipe";
import { UpdateClassStudentDto } from "./dtos/update-class-student.dto";
import { ParseClassStudentPipe } from "./pipes/parse-class-student.pipe";
import { ClassStudent } from "./types/class-student-custom.type";
import { ClassSubjectSagaService } from "./services/class-subject-saga.service";
import { ClassStudentSagaService } from "./services/class-student-saga.service";
import { CheckDuplicateClassPipe } from "./pipes/check-duplicate-class.pipe";
import { CheckClassPropsExistencePipe } from "./pipes/check-class-props-existence.pipe";
import { CheckClassValidPropsPipe } from "./pipes/check-class-valid-props.pipe";
import { Prisma } from "@prisma/client";
import { SelectOption } from "src/interfaces/select-options.interfacte";
import { GradesService } from "./services/grades.service";
import { UpdateGradesDto } from "./dtos/update-grades.dto";

@Controller()
@UseFilters(AllExceptionsFilter)
export class ClassesController {

    constructor(
        private readonly classesService: ClassesService,
        private readonly classSubjectsService: ClassSubjectsService,
        private readonly classStudentsService: ClassStudentsService,
        private readonly classSubjectSagaService: ClassSubjectSagaService,
        private readonly classStudentSagaService: ClassStudentSagaService,
        private readonly gradesService: GradesService
    ) {}

    @MessagePattern({ cmd: 'get-classes' })
    getClasses(
        @Payload('pagination') pagination: Pagination,
        @Payload('sorts') sorts?: Sorting[],
        @Payload('filters') filters?: Filtering[]
    ) {
        return this.classesService.getClasses(pagination, sorts, filters);
    }

    @MessagePattern({ cmd: 'create-class' })
    createClass(
        @Payload(
            CheckClassPropsExistencePipe,
            CheckClassValidPropsPipe,
            CheckDuplicateClassPipe
        ) payload: any,
        @Payload('dto') createClassDto: CreateClassDto
    ) {
        return this.classesService.createClass(createClassDto, payload['levelSubjects'], payload['semesters']);
    }

    @MessagePattern({ cmd: 'update-class' })
    updateClass(
        @Payload(
            CheckClassPropsExistencePipe,
            CheckClassValidPropsPipe,
            CheckDuplicateClassPipe
        ) payload: any,
        @Payload('classId') classId: string,
        @Payload('dto') updateClassDto: UpdateClassDto
    ) {
        return this.classesService.updateClass(classId, updateClassDto);
    }

    @MessagePattern({ cmd: 'delete-class' })
    deleteClass(@Payload(ParseClassPipe) _class: Class) {
        return this.classesService.deleteClass(_class.id);
    }

    @MessagePattern({ cmd: 'get-class' })
    getClass(@Payload(ParseClassPipe) _class: Class) {
        return this.classesService.getClass(_class);
    }

    @MessagePattern({ cmd: 'delete-classes' })
    deleteClasses(
        @Payload('filterQuery') filterQuery: Prisma.ClassWhereInput
    ) {
        return this.classesService.deleteClasses(filterQuery);
    }

    /* Students */
    @MessagePattern({ cmd: 'get-class-students' })
    getClassStudents(
        @Payload('classId', ParseClassPipe) _class: Class,
        @Payload('pagination') pagination: Pagination,
        @Payload('sorts') sorts?: Sorting[],
        @Payload('filters') filters?: Filtering[]
    ) {
        return this.classStudentsService.getClassStudents(_class.id, pagination, sorts, filters);
    }

    @MessagePattern({ cmd: 'get-class-students-with-filter-query' })
    getClassStudentsWithFilterQuery(
        @Payload('filterQuery') filterQuery: Prisma.ClassStudentWhereInput,
        @Payload('selectOption') selectOption?: SelectOption
    ) {
        return this.classStudentsService.getClassStudentsWithFilterQuery(filterQuery, selectOption);
    }

    @MessagePattern({ cmd: 'create-class-student' })
    createClassStudent(
        @Payload(
            CheckClassStudentPropsExistencePipe,
            CheckDuplicateClassStudentPipe
        ) payload: any,
        @Payload('classId', ParseClassPipe) _class: Class,
        @Payload('dto') createClassStudentDto: CreateClassStudentDto 
    ) {
        return this.classStudentsService.createClassStudent(_class.id, createClassStudentDto);
    }

    @MessagePattern({ cmd: 'update-class-student' })
    updateClassStudent(
        @Payload(
            CheckClassStudentPropsExistencePipe,
            CheckDuplicateClassStudentPipe
        ) payload: any,
        @Payload('classId', ParseClassPipe) _class: Class,
        @Payload('classStudentId') classStudentId: string,
        @Payload('dto') updateClassStudentDto: UpdateClassStudentDto 
    ) {
        console.log({ classStudentId, updateClassStudentDto })
        return this.classStudentsService.updateClassStudent(classStudentId, updateClassStudentDto);
    }   
    
    @MessagePattern({ cmd: 'delete-class-student' })
    deleteClassStudent(
        @Payload('classId', ParseClassPipe) _class: Class,
        @Payload('classStudentId', ParseClassStudentPipe) classStudent: ClassStudent   
    ) {
        return this.classStudentsService.deleteClassStudent(classStudent.id);
    }

    @MessagePattern({ cmd: 'get-class-student' })
    getClassStudent(
        @Payload('classId', ParseClassPipe) _class: Class,
        @Payload('classStudentId', ParseClassStudentPipe) classStudent: ClassStudent
    ) {
        return this.classStudentsService.getClassStudent(classStudent);
    }

    @MessagePattern({ cmd: 'delete-class-students' })
    deleteClassStudents(
        @Payload('filterQuery') filterQuery: Prisma.ClassStudentWhereInput
    ) {
        return this.classStudentsService.deleteClassStudents(filterQuery);
    }

    /* Subjects */
    @MessagePattern({ cmd: 'get-class-subjects' })
    getClassSubjects(
        @Payload('classId', ParseClassPipe) _class: Class,
        @Payload('pagination') pagination: Pagination,
        @Payload('sorts') sorts?: Sorting[],
        @Payload('filters') filters?: Filtering[]
    ) {
        return this.classSubjectsService.getClassSubjects(_class.id, pagination, sorts, filters);
    }

    @MessagePattern({ cmd: 'create-class-subject' })
    createClassSubject(
        @Payload(
            CheckClassSubjectPropsExistencePipe,
            CheckClassSubjectValidPropsPipe,
            CheckDuplicateClassSubjectPipe
        ) payload: any,
        @Payload('classId') classId: string,
        @Payload('dto') createClassSubjectDto: CreateclassSubjectDto
    ) {
        return this.classSubjectsService.createClassSubject(classId, createClassSubjectDto);
    }

    @MessagePattern({ cmd: 'update-class-subject' })
    updateClassSubject(
        @Payload(
            CheckClassSubjectPropsExistencePipe,
            CheckClassSubjectValidPropsPipe,
            CheckDuplicateClassSubjectPipe
        ) payload: any,
        @Payload('classSubjectId') classSubjectId: string,
        @Payload('dto') updateClassSubjectDto: UpdateClassSubjectDto
    ) {
        return this.classSubjectsService.updateClassSubject(classSubjectId, updateClassSubjectDto);
    }

    @MessagePattern({ cmd: 'delete-class-subject' })
    deleteClassSubject(
        @Payload('classId', ParseClassPipe) _class: Class,
        @Payload('classSubjectId', ParseClassSubjectPipe) classSubject: ClassSubject
    ) {
        return this.classSubjectsService.deleteClassSubject(classSubject.id);
    }

    @MessagePattern({ cmd: 'get-class-subject' })
    getClassSubject(
        @Payload('classId', ParseClassPipe) _class: Class,
        @Payload('classSubjectId', ParseClassSubjectPipe) classSubject: ClassSubject
    ) {
        return this.classSubjectsService.getClassSubject(classSubject);
    }

    @MessagePattern({ cmd: 'delete-class-subjects' })
    deleteClassSubjects(
        @Payload('filterQuery') filterQuery: Prisma.ClassSubjectWhereInput
    ) {
        return this.classSubjectsService.deleteClassSubjects(filterQuery);
    }

    @MessagePattern({ cmd: 'get-class-subject-without-class-id' })
    getClassSubjectWithoutClassId(
        @Payload(ParseClassSubjectPipe) classSubject: ClassSubject
    ) {
        return this.classSubjectsService.getClassSubject(classSubject);
    }

    /* Grades of Class Subject */
    @MessagePattern({ cmd: 'get-grades-of-class-subject' })
    getGradesOfClassSubject(
        @Payload('classId', ParseClassPipe) _class: Class,
        @Payload('classSubjectId', ParseClassSubjectPipe) classSubject: ClassSubject,
        @Payload('pagination') pagination: Pagination
    ) {
        return this.gradesService.getGradesOfClassSubject(classSubject.id, pagination); 
    }

    @MessagePattern({ cmd: 'update-grades-of-class-subject' })
    updateGradesOfClassSubject(
        @Payload('classId', ParseClassPipe) _class: Class,
        @Payload('classSubjectId', ParseClassSubjectPipe) classSubject: ClassSubject,
        @Payload('dto') updateGradesDto: UpdateGradesDto
    ) {
        return this.gradesService.updateGradesOfClassSubject(classSubject.id, updateGradesDto);
    }
    // -------------------------------------------//



    // -------------------------------------------//
    @MessagePattern({ cmd: 'cancel-create-class-subject' })
    cancelCreateClassSubject(@Payload() classSubjectId: string) {
        return this.classSubjectSagaService.cancelCreateClassSubject(classSubjectId);
    }

    @MessagePattern({ cmd: 'cancel-create-class-student' })
    cancelCreateClassStudent(@Payload() classStudentId: string) {
        return this.classStudentSagaService.cancelCreateClassStudent(classStudentId);
    }
}