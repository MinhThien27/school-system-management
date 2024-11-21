import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { DepartmentTeacher, DepartmentTeacherWithDetail } from "../types/department-teacher-custom.type";
import { DepartmentTeacherWithDetailBuilder } from "../builders/department-teacher-with-detail.builder";

@Injectable()
export class DepartmentTeachersFacade {

    constructor(
        @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
        @Inject('SUBJECT_SERVICE') private readonly subjectServiceClient: ClientProxy
    ) {}

    async getUserAccounctForTeacher(teacher: Record<string, any>): Promise<Record<string, any>> {
        if (!teacher.id) throw new Error('teacherId not null');
        const userAccount =  await firstValueFrom(this.authServiceClient.send(
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

    async getSubjectForAvailableSubjects(availableSubjects: Record<string, any>[]): Promise<Record<string, any>[]> {
        const subjectIds = availableSubjects.map(availableSubject => availableSubject.subjectId);
        const subjects: Record<string, any>[] = await firstValueFrom(this.subjectServiceClient.send(
            { cmd: 'get-subjects-with-subject-ids' },
            subjectIds
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        const returnedAvailableSubjects: Record<string, any>[] = [];
        for (const availableSubject of availableSubjects) {
            const subject = subjects.find(subj => subj.id === availableSubject.subjectId);
            if (subject) {
                returnedAvailableSubjects.push({
                    subjectId: availableSubject.subjectId,
                    subject
                });
            }
        };
        return returnedAvailableSubjects;
    }

    async getDepartmentTeacherWithDetail(departmentTeacher: DepartmentTeacher): Promise<DepartmentTeacherWithDetail> {
        const teacher = await this.getUserAccounctForTeacher(departmentTeacher.teacher);
        const availableSubjects = await this.getSubjectForAvailableSubjects(departmentTeacher.availableSubjects);
        const departmentTeacherWithDetailBuilder = new DepartmentTeacherWithDetailBuilder(departmentTeacher);
        return departmentTeacherWithDetailBuilder
            .withTeacher(teacher)
            .withAvailableSubjects(availableSubjects)
            .build();
    }

    async getDepartmentTeachersWithDetail(departmentTeachers: DepartmentTeacher[]): Promise<DepartmentTeacherWithDetail[]> {
        const departmentTeachersWithDetail: DepartmentTeacherWithDetail[] = [];
        for (const departmentTeacher of departmentTeachers) {
            departmentTeachersWithDetail.push(await this.getDepartmentTeacherWithDetail(departmentTeacher));
        }
        return departmentTeachersWithDetail;
    }
}