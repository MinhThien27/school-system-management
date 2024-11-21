import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { Grade, GradeWithDetail } from "../types/grade-custom.type";
import { GradeWithDetailBuilder } from "../builders/grade-with-detail.builder";

@Injectable()
export class GradesFacade {

    constructor(
        @Inject('CLASS_SERVICE') private readonly classServiceClient: ClientProxy
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

    async getGradeWithDetail(grade: Grade): Promise<GradeWithDetail> {
        const classSubject = await this.getClassSubject(grade.classSubjectId);
        const gradeWithDetailBuilder = new GradeWithDetailBuilder(grade);
        return gradeWithDetailBuilder
            .withClassSubject(classSubject)
            .build();
    }

    async getGradesWithDetail(grades: Grade[]): Promise<GradeWithDetail[]> {
        const gradesWithDetail: GradeWithDetail[] = [];
        for (const grade of grades) {
            gradesWithDetail.push(await this.getGradeWithDetail(grade));
        }
        return gradesWithDetail;
    }
}