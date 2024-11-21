import { Inject, Injectable } from "@nestjs/common";
import { ClassStudentsRepository } from "../repositories/class-students.repository";
import { CreateClassStudentDto } from "../dtos/create-class-student.dto";
import { ClassStudent, ClassStudentWithDetail } from "../types/class-student-custom.type";
import { UpdateClassStudentDto } from "../dtos/update-class-student.dto";
import { Filtering, PaginatedResource, Pagination, Sorting } from "src/interfaces";
import { ClassSubjectsRepository } from "../repositories/class-subjects.repository";
import { CreateClassStudentSagaState } from "../sagas/create-class-student/create-class-student-sage-state";
import { ClientProxy } from "@nestjs/microservices";
import { CreateClassStudentSaga } from "../sagas/create-class-student/create-class-student.saga";
import { Prisma } from "@prisma/client";
import { ClassStudentsFacade } from "../facades/class-students.facade";
import { SelectOption } from "src/interfaces/select-options.interfacte";
import { DeleteClassStudentSaga } from "../sagas/delete-class-student/delete-class-student.saga";
import { DeleteClassStudentSagaState } from "../sagas/delete-class-student/delete-class-student-saga-state";

@Injectable()
export class ClassStudentsService {

    constructor(
        private readonly classStudentsRepository: ClassStudentsRepository,
        private readonly classSubjectsRepository: ClassSubjectsRepository,
        private readonly classStudentsFacade: ClassStudentsFacade,
        @Inject('CLASS_SERVICE') private readonly classServiceClient: ClientProxy,
        @Inject('STUDENT_SERVICE') private readonly studentServiceClient: ClientProxy
    ) {}

    async getClassStudents(
        classId: string, 
        pagination: Pagination, 
        sorts?: Sorting[], 
        filters?: Filtering[]
    ): Promise<PaginatedResource<ClassStudent>> {
        const classStudents = await this.classStudentsRepository.findClassStudents(classId, pagination, sorts, filters);
        const classStudentsWithDetail = await this.classStudentsFacade.getClassStudentsWithDetail(classStudents);
        const classStudentCount = await this.classStudentsRepository.countClassStudents({ classId });
        return {
            totalItems: classStudentCount,
            items: classStudentsWithDetail,
            page: pagination.page,
            size: pagination.size
        };
    }
    
    async getClassStudentsWithFilterQuery(
        filterQuery: Prisma.ClassStudentWhereInput,
        selectOption: SelectOption
    ): Promise<ClassStudentWithDetail[]> {
        return this.classStudentsFacade.getClassStudentsWithDetail(
            await this.classStudentsRepository.findClassStudentsWithFilterQueryWithoutClassId(filterQuery),
            selectOption
        );
    }

    async createClassStudent(classId: string, createClassStudentDto: CreateClassStudentDto): Promise<ClassStudentWithDetail> {
        const classSubjects = await this.classSubjectsRepository.findClassSubjectsWithFilterQuery(classId, {});
        const classStudent = await this.classStudentsRepository.createClassStudent(classId, createClassStudentDto);
        const createClassStudentSagaState = new CreateClassStudentSagaState(
            this.classServiceClient,
            this.studentServiceClient,
            classStudent,
            classSubjects
        );
        const createClassStudentSaga = new CreateClassStudentSaga();
        await createClassStudentSaga.excute(createClassStudentSagaState);
        return this.classStudentsFacade.getClassStudentWithDetail(classStudent);
    }

    async updateClassStudent(classStudentId: string, updateClassStudentDto: UpdateClassStudentDto): Promise<ClassStudentWithDetail> {
        return this.classStudentsFacade.getClassStudentWithDetail(
            await this.classStudentsRepository.updateClassStudent(classStudentId, updateClassStudentDto)
        );
    }

    async deleteClassStudent(classStudentId: string): Promise<ClassStudent> {
        const deletedClassStudent = await this.classStudentsRepository.deleteClassStudent(classStudentId);
        const deleteClassStudentSagaState = new DeleteClassStudentSagaState(
            this.studentServiceClient,
            deletedClassStudent
        );
        const deleteClassStudentSaga = new DeleteClassStudentSaga();
        await deleteClassStudentSaga.excute(deleteClassStudentSagaState);
        return deletedClassStudent;
    }

    async getClassStudent(
        classStudent: ClassStudent
    ): Promise<ClassStudentWithDetail> {
        return this.classStudentsFacade.getClassStudentWithDetail(classStudent);
    }

    async deleteClassStudents(filterQuery: Prisma.ClassStudentWhereInput): Promise<Prisma.BatchPayload> {
        const classStudents = await this.classStudentsRepository.findClassStudentsWithFilterQueryWithoutClassId(filterQuery);
        let count = 0;
        for (const classStudent of classStudents) {
            await this.deleteClassStudent(classStudent.id);
            count++;
        }
        return { count };
    }
}