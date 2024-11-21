import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { ClassStudent, ClassStudentWithDetail } from "../types/class-student-custom.type";
import { ClassStudentWithDetailBuilder } from "../builders/class-student-with-detail.builder";
import { SelectOption } from "src/interfaces/select-options.interfacte";
import { ClassesFacade } from "./classes.facade";

@Injectable()
export class ClassStudentsFacade {

    constructor(
        private readonly classesFacade: ClassesFacade,
        @Inject('STUDENT_SERVICE') private readonly studentServiceClient: ClientProxy
    ) {}

    async getStudent(studentId: string): Promise<Record<string, any>> {
        if (!studentId) throw new Error('studentId not null');
        const selectOption: SelectOption = {
            excludeExternalFields: ['classStudents']
        };
        return await firstValueFrom(this.studentServiceClient.send(
            { cmd: 'get-student-with-filter-query' },
            {
                filterQuery: { id: studentId },
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

    async getClassStudentWithDetail(classStudent: ClassStudent, selectOption?: SelectOption): Promise<ClassStudentWithDetail> {
        let student: Record<string, any>;
        if (!selectOption?.excludeExternalFields.includes('student')) {
            student = await this.getStudent(classStudent.studentId);
        }
        const _class = await this.getFullInfosForClass(classStudent.class);
        const classStudentWithDetailBuilder = new ClassStudentWithDetailBuilder(classStudent);
        return classStudentWithDetailBuilder
            .withStudent(student)
            .withClass(_class)
            .build();
    }

    async getClassStudentsWithDetail(classStudents: ClassStudent[], selectOption?: SelectOption): Promise<ClassStudentWithDetail[]> {
        const classStudentsWithDetail: ClassStudentWithDetail[] = [];
        for (const classStudent of classStudents) {
            classStudentsWithDetail.push(await this.getClassStudentWithDetail(classStudent, selectOption));
        }
        return classStudentsWithDetail;
    }
}