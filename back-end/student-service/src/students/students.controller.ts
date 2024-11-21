import { Controller, UseFilters } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateStudentDto } from "./dtos/create-student.dto";
import { StudentsService } from "./services/students.service";
import { UpdateStudentImageUrlDto } from "./dtos/update-student-image-url.dto";
import { StudentSagaService } from "./services/student-saga.service";
import { UpdateStudentDto } from "./dtos/update-student.dto";
import { Prisma, Student } from "@prisma/client";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { CreateStudentDetailDto } from "./dtos/create-student-detail.dto";
import { StudentDetailService } from "./services/student-detail.service";
import { UpdateStudentDetailDto } from "./dtos/update-student-detail.dto";
import { CheckDuplicateStudenDetailPipe } from "./pipes/check-duplicate-student-detail.pipe";
import { AllExceptionsFilter } from "src/exception-filters";
import { ParseStudentPipe } from "./pipes/parse-student.pipe";
import { CreateParentDto } from "./dtos/create-parent.dto";
import { ParentsService } from "./services/parents.service";
import { ParseParentPipe } from "./pipes/parse-parent.pipe";
import { Parent } from "./types/parent-custom.type";
import { Student as StudentRespone } from "./types/student-custom.type";
import { UpdateParentDto } from "./dtos/update-parent.dto";
import { CreateGradeDto } from "./dtos/create-grade.dto";
import { GradesService } from "./services/grades.service";
import { ParseGradePipe } from "./pipes/parse-grade.pipe";
import { Grade } from "./types/grade-custom.type";
import { UpdateGradeDto } from "./dtos/update-grade.dto";
import { CheckDuplicateStudentPipe } from "./pipes/check-duplicate-student.pipe";
import { ParseStudentDetailPipe } from "./pipes/parse-student-detail.pipe";
import { StudentDetail } from "./types/student-detail-custom.type";
import { SelectOption } from "src/interfaces/select-option.interfacte";

@Controller()
@UseFilters(AllExceptionsFilter)
export class StudentsController {

    constructor(
        private readonly studentsService: StudentsService,
        private readonly studentSagaService: StudentSagaService,
        private readonly studentDetailService: StudentDetailService,
        private readonly parentsService: ParentsService,
        private readonly gradesService: GradesService
    ) {}

    @MessagePattern({ cmd: 'get-students' })
    getStudents(
        @Payload('pagination') pagination: Pagination,
        @Payload('sorts') sorts?: Sorting[],
        @Payload('filters') filters?: Filtering[]
    ) {
        return this.studentsService.getStudents(pagination, sorts, filters);
    }

    @MessagePattern({ cmd: 'create-student' })
    createStudent(
        @Payload(CheckDuplicateStudentPipe) payload: any,
        @Payload('dto') createStudentDto: CreateStudentDto, 
        @Payload('image') image: Express.Multer.File
    ) {
        return this.studentsService.createStudent(createStudentDto, image);
    }

    @MessagePattern({ cmd: 'update-student' })
    updateStudent(
        @Payload(CheckDuplicateStudentPipe) payload: any,
        @Payload('studentId') studentId: string,
        @Payload('dto') updateStudentDto: UpdateStudentDto,
        @Payload('image') image?: Express.Multer.File 
    ) {
        return this.studentsService.updateStudent(studentId, updateStudentDto, image);
    }

    @MessagePattern({ cmd: 'delete-student' })
    deleteStudent(
        @Payload(ParseStudentPipe) student: Student
    ) {
        return this.studentsService.deleteStudent(student.id);
    }

    @MessagePattern({ cmd: 'get-student' })
    getStudent(
        @Payload(ParseStudentPipe) student: Student
    ) {
        return this.studentsService.getStudent(student.id);
    }

    @MessagePattern({ cmd: 'get-student-with-filter-query' })
    getStudentWithFilterQuery(
        @Payload('filterQuery') filterQuery: Prisma.StudentWhereInput,
        @Payload('selectOption') selectOption?: SelectOption
    ) {
        return this.studentsService.getStudentWithFilterQuery(filterQuery, selectOption);
    }

    /* Student Details */
    @MessagePattern({ cmd: 'get-student-detail' })
    getStudentDetail(
        @Payload(ParseStudentPipe) student: Student
    ) {
        return this.studentDetailService.getStudentDetail(student.id);
    }

    @MessagePattern({ cmd: 'create-student-detail' })
    createStudentDetail(
        @Payload(CheckDuplicateStudenDetailPipe) payload: any,
        @Payload('studentId') studentId: string,
        @Payload('dto') createStudentDetailDto: CreateStudentDetailDto
    ) {
        return this.studentDetailService.createStudentDetail(studentId, createStudentDetailDto);
    }

    @MessagePattern({ cmd: 'update-student-detail' })
    updateStudentDetail(
        @Payload(CheckDuplicateStudenDetailPipe) payload: any,
        @Payload('studentId') studentId: string,
        @Payload('studentDetailId', ParseStudentDetailPipe) studentDetail: StudentDetail,
        @Payload('dto') updateStudentDetailDto: UpdateStudentDetailDto
    ) {
        return this.studentDetailService.updateStudentDetail(studentDetail.id, updateStudentDetailDto);
    }

    @MessagePattern({ cmd: 'delete-student-detail' })
    deleteStudentDetail(
        @Payload('studentId', ParseStudentPipe) student: Student,
        @Payload('studentDetailId', ParseStudentDetailPipe) studentDetail: StudentDetail
    ) {
        return this.studentDetailService.deleteStudentDetail(studentDetail.id);
    }

    /* Parents */
    @MessagePattern({ cmd: 'get-parents' })
    getParents(
        @Payload('studentId', ParseStudentPipe) student: Student,
        @Payload('pagination') pagination: Pagination,
        @Payload('sorts') sorts?: Sorting[],
        @Payload('filters') filters?: Filtering[]
    ) {
        return this.parentsService.getParents(student.id, pagination, sorts, filters);
    }

    @MessagePattern({ cmd: 'create-parent' })
    createParent(
        @Payload('studentId', ParseStudentPipe) student: StudentRespone,
        @Payload('dto') createParentDto: CreateParentDto 
    ) {
        return this.parentsService.createParent(student.id, createParentDto);
    }

    @MessagePattern({ cmd: 'update-parent' })
    updateParent(
        @Payload('studentId', ParseStudentPipe) student: StudentRespone,
        @Payload('parentId', ParseParentPipe) parent: Parent,
        @Payload('dto') updateParentDto: UpdateParentDto
    ) {
        return this.parentsService.udpateParent(parent.id, updateParentDto);
    }

    @MessagePattern({ cmd: 'delete-parent' })
    deleteParent(
        @Payload('studentId', ParseStudentPipe) student: StudentRespone,
        @Payload('parentId', ParseParentPipe) parent: Parent
    ) {
        return this.parentsService.deleteParent(parent.id);
    }

    @MessagePattern({ cmd: 'get-parent' })
    getParent(
        @Payload('studentId', ParseStudentPipe) student: StudentRespone,
        @Payload('parentId', ParseParentPipe) parent: Parent
    ) {
        return parent;
    }

    /* Grades */
    @MessagePattern({ cmd: 'get-grades' })
    getGrades(
        @Payload('studentId', ParseStudentPipe) student: Student,
        @Payload('pagination') pagination: Pagination,
        @Payload('sorts') sorts?: Sorting[],
        @Payload('filters') filters?: Filtering[]
    ) {
        return this.gradesService.getGrades(student.id, pagination, sorts, filters);
    }   

    @MessagePattern({ cmd: 'get-grades-with-filter-query' })
    getGradesWithoutStudentId(
        @Payload('filterQuery') filterQuery: Prisma.GradeWhereInput
    ) {
        return this.gradesService.getGradesWithFilterQuery(filterQuery);
    }   

    @MessagePattern({ cmd: 'update-grade' })
    updateGrade(
        @Payload('studentId', ParseStudentPipe) student: Student,
        @Payload('gradeId', ParseGradePipe) grade: Grade,
        @Payload('dto') updateGradeDto: UpdateGradeDto
    ) {
        return this.gradesService.updateGrade(grade.id, updateGradeDto);
    }

    @MessagePattern({ cmd: 'update-grade-with-filter-query' })
    updateGradeWithFilterQuery(
        @Payload('filterQuery') filterQuery: Prisma.GradeWhereUniqueInput,
        @Payload('dto') updateGradeDto: UpdateGradeDto
    ) {
        return this.gradesService.updateGradeWithFilterQuery(filterQuery, updateGradeDto);
    }

    @MessagePattern({ cmd: 'get-grade' })
    getGrade(
        @Payload('studentId', ParseStudentPipe) student: Student,
        @Payload('gradeId', ParseGradePipe) grade: Grade
    ) {
        return this.gradesService.getGrade(grade);
    }

    @MessagePattern({ cmd: 'create-grades' })
    createGrades(
        @Payload('dto') createGradeDto: CreateGradeDto
    ) {
        return this.gradesService.createGrades(createGradeDto);
    }

    @MessagePattern({ cmd: 'delete-grades' })
    deleteGrades(
        @Payload('filterQuery') filterQuery: Prisma.GradeWhereInput
    ) {
        return this.gradesService.deleteGrades(filterQuery);
    }
    // -------------------------------------------//



    // -------------------------------------------//
    @MessagePattern({ cmd: 'cancel-create-student' })
    cancelCreateStudent(@Payload() studentId: string) {
        return this.studentSagaService.cancelCreateStudent(studentId);
    }

    @MessagePattern({ cmd: 'update-student-image-url' })
    updateStudentImageUrl(@Payload() updateStudentImageUrlDto: UpdateStudentImageUrlDto) {
        return this.studentSagaService.updateStudentImageUrl(updateStudentImageUrlDto);
    }

    @MessagePattern({ cmd: 'cancel-update-student' })
    cancelUpdateStudent(@Payload() student: Student) {
        return this.studentSagaService.cancelUpdateStudent(student);
    }

    @MessagePattern({ cmd: 'cancel-delete-student' })
    cancelDeleteStudent(@Payload() student: Student) { 
        return this.studentSagaService.cancelDeleteStudent(student);
    }
}