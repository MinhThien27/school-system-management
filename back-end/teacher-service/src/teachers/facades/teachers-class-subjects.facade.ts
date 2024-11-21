import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { TeacherClassSubject, TeacherClassSubjectWithDetail } from "../types/teacher-class-subject-custom.type";
import { TeacherClassSubjectWithDetailBuilder } from "../builders/teacher-with-class-subject-detail.builder";
import { SelectOption } from "src/interfaces/select-options.interfacte";
import { User } from "../types/teacher-custom.type";

@Injectable()
export class TeacherClassSubjectsFacade {

    constructor(
        @Inject('CLASS_SERVICE') private readonly classServiceClient: ClientProxy,
        @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy
    ) {}

    async getClassSubject(classSubjectId: string): Promise<Record<string, any>> {
        if (!classSubjectId) throw new Error('classSubjectId not null');
        return await firstValueFrom(this.classServiceClient.send(
            { cmd: 'get-class-subject-without-class-id' },
            classSubjectId
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async getUserAccountForTeacher(teacher: Record<string, any>): Promise<Record<string, any>> {
        const userAccount: User = await firstValueFrom(this.authServiceClient.send(
            { cmd: 'get-user-account' },
            teacher.id
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        delete userAccount['password'];
        teacher['user'] = userAccount;
        return teacher;
    }

    async getTeacherClassSubjectWithDetail(
        teacherClassSubject: TeacherClassSubject,
        selectOption?: SelectOption
    ): Promise<TeacherClassSubjectWithDetail> {
        let classSubject: Record<string, any>;
        if (!selectOption?.excludeExternalFields.includes('classSubject')) {
            classSubject = await this.getClassSubject(teacherClassSubject.classSubjectId);
        }
        const teacher = await this.getUserAccountForTeacher(teacherClassSubject.teacher);
        const teacherClassSubjectWithDetailBuilder = new TeacherClassSubjectWithDetailBuilder(teacherClassSubject);
        return teacherClassSubjectWithDetailBuilder
            .withClassSubject(classSubject)
            .withTeacher(teacher)
            .build();
    }

    async getTeacherClassSubjectsWithDetail(
        teacherClassSubjects: TeacherClassSubject[],
        selectOption?: SelectOption
    ): Promise<TeacherClassSubjectWithDetail[]> {
        const teacherClassSubjectsWithDetail: TeacherClassSubjectWithDetail[] = [];
        for (const teacherClassSubject of teacherClassSubjects) {
            teacherClassSubjectsWithDetail.push(await this.getTeacherClassSubjectWithDetail(teacherClassSubject, selectOption));
        }
        return teacherClassSubjectsWithDetail;
    }
}