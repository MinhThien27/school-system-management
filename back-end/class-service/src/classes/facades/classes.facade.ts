import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { Class, ClassWithDetail } from "../types/class-custom.type";
import { ClassWithDetailBuilder } from "../builders/class-with-detail.builder";

@Injectable()
export class ClassesFacade {

    constructor(
        @Inject('SEMESTER_SERVICE') private readonly semesterServiceClient: ClientProxy,
        @Inject('CURRICULUM_SERVICE') private readonly curriculumServiceClient: ClientProxy,
        @Inject('TEACHER_SERVICE') private readonly teacherServiceClient: ClientProxy
    ) {}

    async getAcademicYear(academicYearId: string): Promise<Record<string, any>> {
        if (!academicYearId) throw new Error('academicYearId not null');
        return await firstValueFrom(this.semesterServiceClient.send(
            { cmd: 'get-academic-year' },
            academicYearId
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }
    
    async getLevel(levelId: string): Promise<Record<string, any>> {
        if (!levelId) throw new Error('levelId not null');
        return await firstValueFrom(this.curriculumServiceClient.send(
            { cmd: 'get-level' },
            levelId
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async getFormTeacher(formTeacherId: string): Promise<Record<string, any>> {
        if (!formTeacherId) throw new Error('formTeacherId not null');
        return await firstValueFrom(this.teacherServiceClient.send(
            { cmd: 'get-teacher' },
            formTeacherId
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async getClassWithDetail(_class: Class): Promise<ClassWithDetail> {
        const academicYear = await this.getAcademicYear(_class.academicYearId);
        const level = await this.getLevel(_class.levelId);
        const formTeacher = await this.getFormTeacher(_class.formTeacherId);
        const classWithDetailBuilder = new ClassWithDetailBuilder(_class);
        return classWithDetailBuilder
            .withAcademicYear(academicYear)
            .withLevel(level)
            .withFormTeacher(formTeacher)
            .build();
    }

    async getClassesWithDetail(classes: Class[]): Promise<ClassWithDetail[]> {
        const clasessWithDetail: ClassWithDetail[] = [];
        for (const _class of classes) {
            clasessWithDetail.push(await this.getClassWithDetail(_class));
        }
        return clasessWithDetail;
    }
}