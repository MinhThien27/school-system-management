import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { Student, StudentWithDetail, User } from "../types/student-custom.type";
import { StudentWithDetailBuilder } from "../builders/student-with-detail.builder";
import { SelectOption } from "src/interfaces/select-option.interfacte";

@Injectable()
export class StudentsFacade {

    constructor(
        @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
        @Inject('CLASS_SERVICE') private readonly classServiceClient: ClientProxy
    ) {}

    async getUserAccount(studentId: string): Promise<User> {
        if (!studentId) throw new Error('studentId not null');
        const userAccount: User = await firstValueFrom(this.authServiceClient.send(
            { cmd: 'get-user-account' },
            studentId
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        delete userAccount['password'];
        return userAccount;
    }

    async getClassStudents(studentId: string): Promise<Record<string, any>[]> {
        const selectOption: SelectOption = {
            excludeExternalFields: ['student']
        };
        return await firstValueFrom(this.classServiceClient.send(
            { cmd: 'get-class-students-with-filter-query' },
            { 
                filterQuery: { studentId },
                selectOption
            }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async getStudentWithDetail(student: Student, selectOption?: SelectOption): Promise<StudentWithDetail> {
        let classStudents: Record<string, any>[] = [];
        const userAccount = await this.getUserAccount(student.id);
        if (!selectOption?.excludeExternalFields.includes('classStudents')) {
            classStudents = await this.getClassStudents(student.id);
        }
        const studentWithDetailBuilder = new StudentWithDetailBuilder(student);
        return studentWithDetailBuilder
            .withUserAccount(userAccount)
            .withClassStudents(classStudents)
            .build();
    }

    async getStudentsWithDetail(students: Student[], selectOption?: SelectOption): Promise<StudentWithDetail[]> {
        const studentsWithDetail: StudentWithDetail[] = [];
        for (const student of students) {
            studentsWithDetail.push(await this.getStudentWithDetail(student, selectOption));
        }
        return studentsWithDetail;
    }
}