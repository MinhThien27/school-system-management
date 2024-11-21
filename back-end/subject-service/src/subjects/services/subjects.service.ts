import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { SubjectsRepository } from "../repositories/subjects.repository";
import { CreateSubjectDto } from "../dtos/create-subject.dto";
import { Subject, SubjectWithDetail } from "../types/subject-custom.type";
import { UpdateSubjectDto } from "../dtos/udpate-subject.dto";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { Filtering, PaginatedResource, Pagination, Sorting } from "src/interfaces";
import { DeleteSubjectSagaState } from "../sagas/delete-subject/delete-subject-saga-state";
import { DeleteSubjectSaga } from "../sagas/delete-subject/delete-subject.saga";
import { SubjectsFacade } from "../facades/subjects.facade";

@Injectable()
export class SubjectsService {

    constructor(
        private readonly subjectsRepository: SubjectsRepository,
        private readonly subjectsFacade: SubjectsFacade,
        @Inject('TEACHER_SERVICE') private readonly teacherServiceClient: ClientProxy,
        @Inject('CLASS_SERVICE') private readonly classServiceClient: ClientProxy,
        @Inject('CURRICULUM_SERVICE') private readonly curriculumServiceClient: ClientProxy,
    ) {}

    async getSubjects(
        pagination: Pagination, 
        sorts?: Sorting[], 
        filters?: Filtering[]
    ): Promise<PaginatedResource<SubjectWithDetail>> {
        const subjects = await this.subjectsRepository.findSubjects(pagination, sorts, filters);
        const subjectsWithDetail = await this.subjectsFacade.getSubjectsWithDetail(subjects);
        const subjectCount = await this.subjectsRepository.countSubjects();
        return {
            totalItems: subjectCount,
            items: subjectsWithDetail,
            page: pagination.page,
            size: pagination.size
        };
    }

    getSubjectsWithSubjectIds(subjectIds: string[]): Promise<Subject[]> {
        return this.subjectsRepository.findSubjectsWithSUbjectIds(subjectIds);
    }

    createSubject(createSubjectDto: CreateSubjectDto): Promise<Subject> {
        return this.subjectsRepository.createSubject(createSubjectDto);
    }

    async updateSubject(subject: Subject, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
        if (updateSubjectDto.name && updateSubjectDto.name !== subject.name) {
            const duplicate = await this.subjectsRepository.findUniqueSubject({ name: updateSubjectDto.name });
            if (duplicate) {
                throw new RpcException({ message: `Subject name ${name} already exist`, statusCode: HttpStatus.CONFLICT })
            }
        }
        return this.subjectsRepository.updateSubject(subject.id, updateSubjectDto);
    }

    async deleteSubject(subjectId: string): Promise<Subject> {
        const deletedSubject = await this.subjectsRepository.deleteSubject(subjectId);
        const deleteSubjectSagaState = new DeleteSubjectSagaState(
            this.teacherServiceClient,
            this.classServiceClient,
            this.curriculumServiceClient,
            deletedSubject
        );
        const deleteSubjectSaga = new DeleteSubjectSaga();
        await deleteSubjectSaga.excute(deleteSubjectSagaState);
        return deletedSubject;
    }

    async getSubjectForGateway(subject: Subject): Promise<SubjectWithDetail> {
        return this.subjectsFacade.getSubjectWithDetail(subject);
    }
}