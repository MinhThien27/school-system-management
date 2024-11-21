import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { LevelSubject, LevelSubjectWithDetail } from "../types/level-subject-custom.type";
import { LevelSubjectWithDetailBuilder } from "../builders/level-subject-with-detail.builder";

@Injectable()
export class LevelSubjectsFacade {

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

    async getLevelSubjectWithDetail(levelSubject: LevelSubject): Promise<LevelSubjectWithDetail> {
        const subject = await this.getSubject(levelSubject.subjectId);
        const levelSubjectWithDetailBuilder = new LevelSubjectWithDetailBuilder(levelSubject);
        return levelSubjectWithDetailBuilder
            .withSubject(subject)
            .build();
    }

    async getLevelSubjectsWithDetail(levelSubjects: LevelSubject[]): Promise<LevelSubjectWithDetail[]> {
        const levelSubjectsWithDetail: LevelSubjectWithDetail[] = [];
        for (const levelSubject of levelSubjects) {
            levelSubjectsWithDetail.push(await this.getLevelSubjectWithDetail(levelSubject));
        }
        return levelSubjectsWithDetail;
    }
}