import { Inject, Injectable } from "@nestjs/common";
import { TeachersRepository } from "../repositories/teachers.repository";
import { CreateTeacherDto } from "../dtos/create-teacher.dto";
import { ClientProxy } from "@nestjs/microservices";
import { v4 as uuid } from 'uuid';
import { overrideFileName } from "../utils/files.util";
import { TeacherWithDetail, TeacherWithUserInfos } from "../types/teacher-custom.type";
import { CreateTeacherSagaState } from "../sagas/create-teacher/create-teacher-saga-state";
import { CreateTeacherSaga } from "../sagas/create-teacher/create-teacher.saga";
import { UpdateTeacherDto } from "../dtos/update-teacher.dto";
import { UpdateTeacherSagaState } from "../sagas/update-teacher/update-teacher-saga-state";
import { DeleteTeacherSagaState } from "../sagas/delete-teacher/delete-teacher-saga-state";
import { Filtering, PaginatedResource, Pagination, Sorting } from "src/interfaces";
import { UpdateTeacherSaga } from "../sagas/update-teacher/update-student.saga";
import { DeleteTeacherSaga } from "../sagas/delete-teacher/delete-student.saga";
import { DepartmentTeachersRepository } from "src/departments/repositories/department-teachers.repository";
import { TeachersFacade } from "../facades/teachers.facade";

@Injectable()
export class TeachersService {

    constructor(
        private readonly teachersRepository: TeachersRepository,
        private readonly teachersFacade: TeachersFacade,
        private readonly departmentsRepository: DepartmentTeachersRepository,
        @Inject('TEACHER_SERVICE') private readonly teacherServiceClient: ClientProxy,
        @Inject('IMAGE_SERVICE') private readonly imageServiceClient: ClientProxy,
        @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
        @Inject('CLASS_SERVICE') private readonly classServiceClient: ClientProxy
    ) { }

    async getTeachers(
        pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]
    ): Promise<PaginatedResource<TeacherWithDetail>> {
        const teachers = await this.teachersRepository.findTeachers(pagination, sorts, filters);
        const teachersWithDetail = await this.teachersFacade.getTeachersWithDetail(teachers);
        const teacherCount = await this.teachersRepository.countTeachers();
        return {
            totalItems: teacherCount,
            items: teachersWithDetail,
            page: pagination.page,
            size: pagination.size
        };
    }

    async createTeacher(
        createTeacherDto: CreateTeacherDto, 
        image: Express.Multer.File
    ): Promise<TeacherWithUserInfos | TeacherWithDetail> {
        const { citizenIdentification, phoneNumber, ...createTeacher } = createTeacherDto;
        const teacherId = uuid();
        image.originalname = overrideFileName(image.originalname, teacherId);
        createTeacher.dob = new Date(createTeacherDto.dob);
        createTeacher.startDate = new Date(createTeacherDto.startDate);
        const email = `${createTeacherDto.citizenIdentification}@gmail.com`;
        const password = '123456';
        const createdTeacher = await this.teachersRepository.createTeacher(teacherId, createTeacher);
        const createTeacherSagaState = new CreateTeacherSagaState(
            this.teacherServiceClient,
            this.imageServiceClient,
            this.authServiceClient,
            createdTeacher,
            email,
            password,
            citizenIdentification,
            phoneNumber,
            image
        );
        const createTeacherSaga = new CreateTeacherSaga();
        await createTeacherSaga.excute(createTeacherSagaState);
        createdTeacher.imageUrl = createTeacherSagaState.getImageUrl();
        const response = {
            ...createdTeacher,
            user: {
                email: createTeacherSagaState.getEmail(),
                role: createTeacherSagaState.getRole(),
                citizenIdentification: createTeacherSagaState.getCitizenIdentification(),
                phoneNumber: createTeacherSagaState.getPhoneNumber()
            }
        }
        return response;
    }

    async updateTeacher(
        teacherId: string,
        updateTeacherDto: UpdateTeacherDto,
        image?: Express.Multer.File
    ): Promise<TeacherWithUserInfos> {
        let newEmail: string;
        const { citizenIdentification, phoneNumber, role, ...updateTeacher } = updateTeacherDto;
        const oldTeacher = await this.teachersRepository.findUniqueTeacher({ id: teacherId });
        if (updateTeacherDto.dob) updateTeacher.dob = new Date(updateTeacherDto.dob);
        if (updateTeacherDto.startDate) updateTeacher.startDate = new Date(updateTeacherDto.startDate);
        if (updateTeacherDto.citizenIdentification) newEmail = `${citizenIdentification}@gmail.com`;
        if (image) image.originalname = overrideFileName(image.originalname, oldTeacher.id);
        const updatedTeacher = await this.teachersRepository.updateTeacher(teacherId, updateTeacher);
        const updateTeacherSagaState = new UpdateTeacherSagaState(
            this.teacherServiceClient,
            this.imageServiceClient,
            this.authServiceClient,
            oldTeacher,
            updatedTeacher,
            newEmail,
            citizenIdentification,
            phoneNumber,
            role,
            image
        );
        const updateTeacherSaga = new UpdateTeacherSaga();
        await updateTeacherSaga.excute(updateTeacherSagaState);
        updatedTeacher.imageUrl = updateTeacherSagaState.getNewImageUrl() ?? updatedTeacher.imageUrl;
        const response = {
            ...updatedTeacher,
            user: {
                email: updateTeacherSagaState.getEmail(),
                citizenIdentification: updateTeacherSagaState.getCitizenIdentification(),
                phoneNumber: updateTeacherSagaState.getPhoneNumber(),
                role: updateTeacherSagaState.getRole()
            }
        }
        return response;
    }

    async deleteTeacher(teacherId: string): Promise<TeacherWithUserInfos> {
        const deletedTeacher = await this.teachersRepository.deleteTeacher(teacherId);
        const deleteTeacherSagaState = new DeleteTeacherSagaState(
            this.teacherServiceClient,
            this.imageServiceClient,
            this.authServiceClient,
            this.classServiceClient,
            deletedTeacher
        );
        const deleteTeacherSaga = new DeleteTeacherSaga();
        await deleteTeacherSaga.excute(deleteTeacherSagaState);
        const reponse = {
            ...deletedTeacher,
            user: {
                email: deleteTeacherSagaState.getEmail(),
                citizenIdentification: deleteTeacherSagaState.getCitizenIdentification(),
                phoneNumber: deleteTeacherSagaState.getPhoneNumber(),
                role: deleteTeacherSagaState.getRole()
            }
        };
        return reponse;
    }

    async getTeacher(teacherId: string): Promise<TeacherWithDetail> {
        const teacher = await this.teachersRepository.findUniqueTeacher({ id: teacherId });
        const teacherWithDetail = await this.teachersFacade.getTeacherWithDetail(teacher);
        return teacherWithDetail;
    }
}