import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { ClassSubject, ClassSubjectWithDetail } from "../types/class-subject-custom.type";
import { ClassSubjectWithDetailBuilder } from "../builders/class-subject-with-detail.builder";
import { SelectOption } from "src/interfaces/select-options.interfacte";
import { ClassesFacade } from "./classes.facade";

@Injectable()
export class ClassSubjectsFacade {

    constructor(
        private readonly classesFacade: ClassesFacade,
        @Inject('SUBJECT_SERVICE') private readonly subjectServiceClient: ClientProxy,
        @Inject('SEMESTER_SERVICE') private readonly semesterServiceClient: ClientProxy,
        @Inject('TEACHER_SERVICE') private readonly teacherServiceClient: ClientProxy
    ) {}

    async getSubject(subjectId: string): Promise<Record<string, any>> {
        if (!subjectId) throw new Error('subjectId not null');
        return await firstValueFrom(this.subjectServiceClient.send(
            { cmd: 'get-subject' },
            subjectId
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async getSemester(semesterId: string): Promise<Record<string, any>> {
        if (!semesterId) throw new Error('semesterId not null');
        return await firstValueFrom(this.semesterServiceClient.send(
            { cmd: 'get-semester-without-academic-year-id' },
            semesterId
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async getTeacherClassSubjects(classSubjectId: string): Promise<Record<string, any>[]> {
        if (!classSubjectId) throw new Error('classSubjectId not null');
        const selectOption: SelectOption = {
            excludeExternalFields: ['classSubject']
        };
        return await firstValueFrom(this.teacherServiceClient.send(
            { cmd: 'get-teacher-class-subjects-with-filter-query' },
            {
                filterQuery: { classSubjectId },
                selectOption
            }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async getFullInfosForClass(_class: Record<string, any>): Promise<Record<string, any>> {
        return await this.classesFacade.getClassWithDetail(_class as any);
    }

    async getClassSubjectWithDetail(classSubject: ClassSubject): Promise<ClassSubjectWithDetail> {
        const subject = await this.getSubject(classSubject.subjectId);
        const semester = await this.getSemester(classSubject.semesterId);
        const _class = await this.getFullInfosForClass(classSubject.class);
        const teacherClassSubjects = await this.getTeacherClassSubjects(classSubject.id);
        const classSubjectWithDetailBuilder = new ClassSubjectWithDetailBuilder(classSubject);
        return classSubjectWithDetailBuilder
            .withSubject(subject)
            .withSemester(semester)
            .withClass(_class)
            .withTeacherClassSubjects(teacherClassSubjects)
            .build();
    }

    async getClassSubjectsWithDetail(classSubjects: ClassSubject[]): Promise<ClassSubjectWithDetail[]> {
        const classSubjectsWithDetail: ClassSubjectWithDetail[] = [];
        for (const classSubject of classSubjects) {
            classSubjectsWithDetail.push(await this.getClassSubjectWithDetail(classSubject));
        }
        return classSubjectsWithDetail;
    }
}