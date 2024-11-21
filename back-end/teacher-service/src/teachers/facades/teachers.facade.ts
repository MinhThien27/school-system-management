import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Teacher, TeacherWithDetail, User } from "../types/teacher-custom.type";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { TeacherWithDetailBuilder } from "../builders/teacher-with-detail.builder";

@Injectable()
export class TeachersFacade {

    constructor(
        @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy
    ) {}

    async getUserAccount(teacherId: string): Promise<User>{
        if (!teacherId) throw new Error('teacherId not null');
        const userAccount: User = await firstValueFrom(this.authServiceClient.send(
            { cmd: 'get-user-account' },
            teacherId
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        delete userAccount['password'];
        return userAccount;
    }

    async getUserAccountForEachHeadTeaherInDepartment(departmentTeachers: Record<string, any>[]): Promise<Record<string, any>[]> {
        if (departmentTeachers.length) {
            for (const departmentTeacher of departmentTeachers) {
                const departmentTeacherUserAccount: User = await firstValueFrom(this.authServiceClient.send(
                    { cmd: 'get-user-account' },
                    departmentTeacher.department.headTeacher.id
                ).pipe(timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutRpcException())
                })));
                delete departmentTeacherUserAccount['password'];
                departmentTeacher.department.headTeacher['user'] = departmentTeacherUserAccount;
            }
        }
        return departmentTeachers;
    }

    async getTeacherWithDetail(teacher: Teacher): Promise<TeacherWithDetail> {
        const userAccount = await this.getUserAccount(teacher.id);
        const departmentTeachersWithUAForEachHTInDepartment = await this.getUserAccountForEachHeadTeaherInDepartment(teacher.departmentTeachers);
        const teacherWithDetailBuilder = new TeacherWithDetailBuilder(teacher);
        return teacherWithDetailBuilder
            .withUserAccount(userAccount)
            .withDepartmentTeachers(departmentTeachersWithUAForEachHTInDepartment)
            .build();
    }

    async getTeachersWithDetail(teachers: Teacher[]): Promise<TeacherWithDetail[]> {
        const teachersWithDetail: TeacherWithDetail[] = [];
        for (const teacher of teachers) {
            teachersWithDetail.push(await this.getTeacherWithDetail(teacher));
        }
        return teachersWithDetail;
    }
}