import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { Subject } from "src/subjects/types/subject-custom.type";

export class DeleteSubjectSagaState {

    constructor(
        private readonly teacherServiceClient: ClientProxy,
        private readonly classServiceClient: ClientProxy,
        private readonly curriculumServiceClient: ClientProxy,
        private readonly subject: Subject
    ) { }

    async makeDeleteDepartmentSubjectsCommand() {
        console.log('Run makeDeleteDepartmentSubjectsCommand')
        await firstValueFrom(this.teacherServiceClient.send(
            { cmd: 'delete-department-subjects' },
            { subjectId: this.subject.id }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async makeDeleteAvailableTeacherSubjectsCommand() {
        console.log('Run makeDeleteAvailableTeacherSubjectsCommand')
        await firstValueFrom(this.teacherServiceClient.send(
            { cmd: 'delete-available-teacher-subjects' },
            { subjectId: this.subject.id }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async makeDeleteLevelSubjectsCommand() {
        console.log('Run makeDeleteLevelSubjectsCommand')
        await firstValueFrom(this.curriculumServiceClient.send(
            { cmd: 'delete-level-subjects' },
            { subjectId: this.subject.id }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async makeDeleteClassSubjectsCommand() {
        console.log('Run makeDeleteClassSubjectsCommand')
        await firstValueFrom(this.classServiceClient.send(
            { cmd: 'delete-class-subjects' },
            { subjectId: this.subject.id }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }
}