import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";

export class DeleteClassSagaState {

    constructor(
        private readonly teacherServiceClient: ClientProxy,
        private readonly studentServiceClient: ClientProxy,
        private readonly classSubjectIds: string[]
    ) { }

    async makeDeleteTeacherClassSubjectsCommand() {
        console.log('Run makeDeleteTeacherClassSubjectsCommand')
        await firstValueFrom(this.teacherServiceClient.send(
            { cmd: 'delete-teacher-class-subjects' },
            { classSubjectId: {
                in: this.classSubjectIds
            }}
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async makeDeleteGradesCommand() {
        console.log('Run makeDeleteGradesCommand')
        await firstValueFrom(this.studentServiceClient.send(
            { cmd: 'delete-grades' },
            { classSubjectId: {
                in: this.classSubjectIds
            }}
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }
}