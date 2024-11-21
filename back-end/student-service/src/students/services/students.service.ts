import { Inject, Injectable } from "@nestjs/common";
import { StudentsRepository } from "../repositories/students.repository";
import { CreateStudentDto } from "../dtos/create-student.dto";
import { ClientProxy } from "@nestjs/microservices";
import { v4 as uuid } from 'uuid';
import { overrideFileName } from "../utils/files.util";
import { StudentWithDetail, StudentWithUserInfos } from "../types/student-custom.type";
import { CreateStudentSagaState } from "../sagas/create-student/create-student-saga-state";
import { CreateStudentSaga } from "../sagas/create-student/create-student.saga";
import { UpdateStudentDto } from "../dtos/update-student.dto";
import { UpdateStudentSagaState } from "../sagas/update-student/update-student-saga-state";
import { UpdateStudentSaga } from "../sagas/update-student/update-student.saga";
import { DeleteStudentSagaState } from "../sagas/delete-student/delete-student-saga-state";
import { DeleteStudentSaga } from "../sagas/delete-student/delete-student.saga";
import { Filtering, PaginatedResource, Pagination, Sorting } from "src/interfaces";
import { StudentsFacade } from "../facades/students.facade";
import { Prisma } from "@prisma/client";
import { SelectOption } from "src/interfaces/select-option.interfacte";
import { StudentFilterHelper } from "../helpers/student-filter.helper";

@Injectable()
export class StudentsService {

    constructor(
        private readonly studentsRepository: StudentsRepository,
        private readonly studentsFacade: StudentsFacade,
        @Inject('STUDENT_SERVICE') private readonly studentServiceClient: ClientProxy,
        @Inject('IMAGE_SERVICE') private readonly imageServiceClient: ClientProxy,
        @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
        @Inject('CLASS_SERVICE') private readonly classServiceClient: ClientProxy
    ) { }

    async getStudents(
        pagination: Pagination, 
        sorts?: Sorting[], 
        filters?: Filtering[]
    ): Promise<PaginatedResource<StudentWithDetail>> {
        let hasExternalFilter = false;
        const studentFilters: Filtering[] = [];
        let externalFilter: Filtering;
        if (filters && filters.length) {
            for (const filter of filters) {
                if (filter.property === 'academicYearId') {
                    externalFilter = filter;
                    hasExternalFilter = true;
                }
                else studentFilters.push(filter);
            }
        }
        const students = await this.studentsRepository.findStudents(pagination, sorts, studentFilters);
        let studentsWithDetail = await this.studentsFacade.getStudentsWithDetail(students);
        if (hasExternalFilter) studentsWithDetail = new StudentFilterHelper(studentsWithDetail).filterByAcademicYearId(externalFilter.value);
        const studentCount = await this.studentsRepository.countStudents();
        return {
            totalItems: studentCount,
            items: studentsWithDetail,
            page: pagination.page,
            size: pagination.size
        };
    }

    async createStudent(
        createStudentDto: CreateStudentDto, 
        image: Express.Multer.File
    ): Promise<StudentWithUserInfos> {
        const { citizenIdentification, phoneNumber, ...createStudent } = createStudentDto;
        const studentId = uuid();
        image.originalname = overrideFileName(image.originalname, studentId);
        createStudent.dob = new Date(createStudentDto.dob);
        createStudent.enrollmentDate = new Date(createStudentDto.enrollmentDate);
        const email = `${createStudentDto.citizenIdentification}@gmail.com`;
        const password = '123456';
        const createdStudent = await this.studentsRepository.createStudent(studentId, createStudent);
        const createStudentSagaState = new CreateStudentSagaState(
            this.studentServiceClient,
            this.imageServiceClient,
            this.authServiceClient,
            createdStudent,
            email,
            password,
            citizenIdentification,
            phoneNumber,
            image
        );
        const createStudentSaga = new CreateStudentSaga();
        await createStudentSaga.excute(createStudentSagaState);
        createdStudent.imageUrl = createStudentSagaState.getImageUrl();
        const response = {
            ...createdStudent,
            user: {
                email: createStudentSagaState.getEmail(),
                role: createStudentSagaState.getRole(),
                citizenIdentification: createStudentSagaState.getCitizenIdentification(),
                phoneNumber: createStudentSagaState.getPhoneNumber()
            }
        }
        return response;
    }

    async updateStudent(
        studentId: string,
        updateStudentDto: UpdateStudentDto,
        image?: Express.Multer.File
    ): Promise<StudentWithUserInfos> {
        let newEmail: string;
        const { citizenIdentification, phoneNumber, role, ...updateStudent } = updateStudentDto;
        const oldStudent = await this.studentsRepository.findUniqueStudent({ id: studentId });
        if (updateStudentDto.dob) updateStudent.dob = new Date(updateStudentDto.dob);
        if (updateStudentDto.enrollmentDate) updateStudent.enrollmentDate = new Date(updateStudentDto.enrollmentDate);
        if (updateStudentDto.citizenIdentification) newEmail = `${citizenIdentification}@gmail.com`;
        if (image) image.originalname = overrideFileName(image.originalname, oldStudent.id);
        const updatedStudent = await this.studentsRepository.updateStudent(studentId, updateStudent);
        const updateStudentSagaState = new UpdateStudentSagaState(
            this.studentServiceClient,
            this.imageServiceClient,
            this.authServiceClient,
            oldStudent,
            updatedStudent,
            newEmail,
            citizenIdentification,
            phoneNumber,
            role,
            image
        );
        const updateStudentSaga = new UpdateStudentSaga();
        await updateStudentSaga.excute(updateStudentSagaState);
        updatedStudent.imageUrl = updateStudentSagaState.getNewImageUrl() ?? updatedStudent.imageUrl;
        const response = {
            ...updatedStudent,
            user: {
                email: updateStudentSagaState.getEmail(),
                citizenIdentification: updateStudentSagaState.getCitizenIdentification(),
                phoneNumber: updateStudentSagaState.getPhoneNumber(),
                role: updateStudentSagaState.getRole()
            }
        }
        return response;
    }

    async deleteStudent(studentId: string): Promise<StudentWithUserInfos> {
        const deletedStudent = await this.studentsRepository.deleteStudent(studentId);
        const deleteStudentSagaState = new DeleteStudentSagaState(
            this.studentServiceClient,
            this.imageServiceClient,
            this.authServiceClient,
            this.classServiceClient,
            deletedStudent
        );
        const deleteStudentSaga = new DeleteStudentSaga();
        await deleteStudentSaga.excute(deleteStudentSagaState);
        const reponse = {
            ...deletedStudent,
            user: {
                email: deleteStudentSagaState.getEmail(),
                citizenIdentification: deleteStudentSagaState.getCitizenIdentification(),
                phoneNumber: deleteStudentSagaState.getPhoneNumber(),
                role: deleteStudentSagaState.getRole()
            }
        };
        return reponse;
    }

    async getStudent(studentId: string): Promise<StudentWithDetail> {
        const student = await this.studentsRepository.findUniqueStudent({ id: studentId });
        const studentWithDetail = await this.studentsFacade.getStudentWithDetail(student);
        return studentWithDetail;
    }

    async getStudentWithFilterQuery(
        filterQuery: Prisma.StudentWhereInput,
        selectOption?: SelectOption
    ): Promise<StudentWithDetail> {
        const student = await this.studentsRepository.findStudent(filterQuery);
        const studentWithDetail = await this.studentsFacade.getStudentWithDetail(student, selectOption);
        return studentWithDetail;
    }
}