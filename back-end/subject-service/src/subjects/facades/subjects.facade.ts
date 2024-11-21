import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { Subject, SubjectWithDetail } from "../types/subject-custom.type";
import { SubjectWithDetailBuilder } from "../builders/subject-with-detail.builder";

@Injectable()
export class SubjectsFacade {

    constructor(
        @Inject('TEACHER_SERVICE') private readonly teacherServiceClient: ClientProxy
    ) {}

    async getAvailableSubjects(subjectId: string): Promise<Record<string, any>[]>{
        if (!subjectId) throw new Error('subjectId not null');
        return await firstValueFrom(this.teacherServiceClient.send(
            { cmd: 'get-available-teacher-subjects-with-filter-query' },
            {
                filterQuery: { subjectId }
            }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async getSubjectWithDetail(subject: Subject): Promise<SubjectWithDetail> {
        const availableTeacherSubjects = await this.getAvailableSubjects(subject.id);
        const subjectWithDetailBuilder = new SubjectWithDetailBuilder(subject);
        return subjectWithDetailBuilder
            .withAvailableTeacherSubjects(availableTeacherSubjects)
            .build();
    }

    async getSubjectsWithDetail(subjects: Subject[]): Promise<SubjectWithDetail[]> {
        const subjectsWithDetail: SubjectWithDetail[] = [];
        for (const subject of subjects) {
            subjectsWithDetail.push(await this.getSubjectWithDetail(subject));
        }
        return subjectsWithDetail;
    }
}