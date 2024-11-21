import { Inject, Injectable } from "@nestjs/common";
import { ClassesRepository } from "../repositories/classes.repository";
import { CreateClassDto } from "../dtos/create-class.dto";
import { Class, ClassWithDetail } from "../types/class-custom.type";
import { UpdateClassDto } from "../dtos/update-class.dto";
import { Filtering, PaginatedResource, Pagination, Sorting } from "src/interfaces";
import { CreateclassSubjectDto } from "../dtos/create-class-subject.dto";
import { Prisma } from "@prisma/client";
import { ClassSubjectsRepository } from "../repositories/class-subjects.repository";
import { DeleteClassSagaState } from "../sagas/delete-class/delete-class-saga-state";
import { ClientProxy } from "@nestjs/microservices";
import { DeleteClassSaga } from "../sagas/delete-class/delete-class.saga";
import { ClassesFacade } from "../facades/classes.facade";

@Injectable()
export class ClassesService {

    constructor(
        private readonly classesRepository: ClassesRepository,
        private readonly classSubjectsRepository: ClassSubjectsRepository,
        private readonly classesFacade: ClassesFacade,
        @Inject('CLASS_SERVICE') private readonly classServiceClient: ClientProxy,
        @Inject('TEACHER_SERVICE') private readonly teacherServiceClient: ClientProxy,
        @Inject('STUDENT_SERVICE') private readonly studentServiceClient: ClientProxy
    ) {}

    async getClasses(
        pagination: Pagination, 
        sorts?: Sorting[], 
        filters?: Filtering[]
    ): Promise<PaginatedResource<ClassWithDetail>> {
        const classes = await this.classesRepository.findClasses(pagination, sorts, filters);
        const classesWithDetail = await this.classesFacade.getClassesWithDetail(classes);
        const classCount = await this.classesRepository.countClasses();
        return {
            totalItems: classCount,
            items: classesWithDetail,
            page: pagination.page,
            size: pagination.size
        };
    }

    async createClass(
        createClassDto: CreateClassDto, 
        levelSubjects: Record<string, any>[], 
        semesters: Record<string, any>[]
    ): Promise<ClassWithDetail> {
        const createManyClassSubjects: CreateclassSubjectDto[] = [];
        for(const semester of semesters) {
            for (const levelSubject of levelSubjects) {
                if (levelSubject.semesterNumber === semester.semesterNumber) {
                    createManyClassSubjects.push({
                        subjectId: levelSubject.subjectId,
                        semesterId: semester.id,
                        startDate: semester.startDate,
                        endDate: semester.endDate,
                        status: "Active"
                    });
                }
            }
        }
        return this.classesFacade.getClassWithDetail(
            await this.classesRepository.createClass(createClassDto, createManyClassSubjects)
        );
    }

    async updateClass(classId: string, updateClassDto: UpdateClassDto): Promise<ClassWithDetail> {
        return this.classesFacade.getClassWithDetail(
            await this.classesRepository.updateClass(classId, updateClassDto)
        );
    }

    async deleteClass(classId: string): Promise<Class> {
        const classSubjects = await this.classSubjectsRepository.findClassSubjectsWithFilterQuery(classId, {});
        const classSubjectIds = classSubjects.map(classSubject => classSubject.id);
        const deletedSubject = await this.classesRepository.deleteClass(classId);
        const deleteClassSagaState = new DeleteClassSagaState(
            this.teacherServiceClient,
            this.studentServiceClient,
            classSubjectIds
        );
        const deleteClassSaga = new DeleteClassSaga();
        await deleteClassSaga.excute(deleteClassSagaState);
        return deletedSubject;
    }

    async getClass(_class: Class): Promise<ClassWithDetail> {
        return this.classesFacade.getClassWithDetail(_class);
    }

    async deleteClasses(filterQuery: Prisma.ClassWhereInput): Promise<Prisma.BatchPayload> {
        const classes = await this.classesRepository.findClassesWithFilterQuery(filterQuery);
        let count = 0;
        for (const _class of classes) {
            await this.deleteClass(_class.id);
            count++;
        };
        return { count };
    }
}