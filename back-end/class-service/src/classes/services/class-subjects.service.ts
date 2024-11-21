import { Inject, Injectable } from "@nestjs/common";
import { ClassSubjectsRepository } from "../repositories/class-subjects.repository";
import { CreateclassSubjectDto } from "../dtos/create-class-subject.dto";
import { ClassSubject, ClassSubjectWithDetail } from "../types/class-subject-custom.type";
import { UpdateClassSubjectDto } from "../dtos/update-class-subject.dto";
import { Filtering, PaginatedResource, Pagination, Sorting } from "src/interfaces";
import { ClassStudentsRepository } from "../repositories/class-students.repository";
import { CreateClassSubjectSagaState } from "../sagas/create-class-subject/create-class-subject-saga-state";
import { CreateClassSubjectSaga } from "../sagas/create-class-subject/create-class-subject.saga";
import { ClientProxy } from "@nestjs/microservices";
import { DeleteClassSubjectSagaState } from "../sagas/delete-class-subject/delete-class-subject-saga-state";
import { DeleteClassSubjectSaga } from "../sagas/delete-class-subject/delete-class-subject.saga";
import { Prisma } from "@prisma/client";
import { ClassSubjectsFacade } from "../facades/class-subjects.facade";

@Injectable()
export class ClassSubjectsService {

    constructor(
        private readonly classSubjectsRepository: ClassSubjectsRepository,
        private readonly classStudentsRepository: ClassStudentsRepository,
        private readonly classSubjectsFacade: ClassSubjectsFacade,
        @Inject('CLASS_SERVICE') private readonly classServiceClient: ClientProxy,
        @Inject('TEACHER_SERVICE') private readonly teacherServiceClient: ClientProxy,
        @Inject('STUDENT_SERVICE') private readonly studentServiceClient: ClientProxy
    ) {}

    async getClassSubjects(
        classId: string, 
        pagination: Pagination, 
        sorts?: Sorting[], 
        filters?: Filtering[]
    ): Promise<PaginatedResource<ClassSubjectWithDetail>> {
        const classSubjects = await this.classSubjectsRepository.findClassSubjects(classId, pagination, sorts, filters);
        const classSubjectsWithDetail = await this.classSubjectsFacade.getClassSubjectsWithDetail(classSubjects);
        const classSubjectCount = await this.classSubjectsRepository.countClassSubjects({ classId });
        return {
            totalItems: classSubjectCount,
            items: classSubjectsWithDetail,
            page: pagination.page,
            size: pagination.size
        };
    }
    
    async createClassSubject(classId: string, createClassSubjectDto: CreateclassSubjectDto): Promise<ClassSubjectWithDetail> {
        const classStudents = await this.classStudentsRepository.findClassStudentsWithFilterQuery(classId, {});
        const classSubject = await this.classSubjectsRepository.createClassSubject(classId, createClassSubjectDto);
        const createClassSubjectSagaState = new CreateClassSubjectSagaState(
            this.classServiceClient,
            this.studentServiceClient,
            classSubject,
            classStudents
        );
        const createClassSubjectSaga = new CreateClassSubjectSaga();
        await createClassSubjectSaga.excute(createClassSubjectSagaState);
        return this.classSubjectsFacade.getClassSubjectWithDetail(classSubject);
    }

    async updateClassSubject(classSubjectId: string, updateClassSubjectDto: UpdateClassSubjectDto): Promise<ClassSubjectWithDetail> {
        return this.classSubjectsFacade.getClassSubjectWithDetail(
            await this.classSubjectsRepository.updateClassSubject(classSubjectId, updateClassSubjectDto)
        );
    }

    async deleteClassSubject(classSubjectId: string): Promise<ClassSubject> {
        const deletedClassSubject = await this.classSubjectsRepository.deleteClassSubject(classSubjectId)
        const deleteClassSubjectSagaState = new DeleteClassSubjectSagaState(
            this.teacherServiceClient,
            this.studentServiceClient,
            deletedClassSubject
        );
        const deleteClassSubjectSaga = new DeleteClassSubjectSaga();
        await deleteClassSubjectSaga.excute(deleteClassSubjectSagaState);
        return deletedClassSubject;
    }

    async getClassSubject(
        classSubject: ClassSubject
    ): Promise<ClassSubjectWithDetail> {
        return this.classSubjectsFacade.getClassSubjectWithDetail(classSubject);
    }

    async deleteClassSubjects(filterQuery: Prisma.ClassSubjectWhereInput): Promise<Prisma.BatchPayload> {
        const classSubjects = await this.classSubjectsRepository.findClassSubjectsWithFilterQueryWithoutClassId(filterQuery);
        let count = 0;
        for (const classSubject of classSubjects) {
            await this.deleteClassSubject(classSubject.id);
            count++;
        };
        return { count };
    }
}