import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { DepartmentSubject, DepartmentSubjectWithDetail } from "../types/department-subject-custom.type";
import { DepartmentSubjectWithDetailBuilder } from "../builders/department-subject-with-detail.builder";

@Injectable()
export class DepartmentSubjectsFacade {

    constructor(
        @Inject('SUBJECT_SERVICE') private readonly subjectServiceClient: ClientProxy
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

    async getDepartmentSubjectWithDetail(departmentSubject: DepartmentSubject): Promise<DepartmentSubjectWithDetail> {
        const subject = await this.getSubject(departmentSubject.subjectId);
        const departmentSubjectWithDetailBuilder = new DepartmentSubjectWithDetailBuilder(departmentSubject);
        return departmentSubjectWithDetailBuilder
            .withSubject(subject)
            .build();
    }

    async getDepartmentSubjectsWithDetail(departmentSubjects: DepartmentSubject[]): Promise<DepartmentSubjectWithDetail[]> {
        const departmentSubjectsWithDetail: DepartmentSubjectWithDetail[] = [];
        for (const departmentSubject of departmentSubjects) {
            departmentSubjectsWithDetail.push(await this.getDepartmentSubjectWithDetail(departmentSubject));
        }
        return departmentSubjectsWithDetail;
    }
}