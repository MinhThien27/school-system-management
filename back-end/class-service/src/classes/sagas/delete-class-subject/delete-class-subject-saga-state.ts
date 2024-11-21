import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { ClassSubject } from "src/classes/types/class-subject-custom.type";
import { RequestTimeoutRpcException } from "src/exceptoins";

export class DeleteClassSubjectSagaState {

    constructor(
        private readonly teacherServiceClient: ClientProxy,
        private readonly studentServiceClient: ClientProxy,
        private readonly classSubject: ClassSubject
    ) { }

    async makeDeleteTeacherClassSubjectsCommand() {
        console.log('Run makeDeleteTeacherClassSubjectsCommand')
        await firstValueFrom(this.teacherServiceClient.send(
            { cmd: 'delete-teacher-class-subjects' },
            { classSubjectId: this.classSubject.id }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async makeDeleteGradesCommand() {
        console.log('Run makeDeleteGradesCommand')
        await firstValueFrom(this.studentServiceClient.send(
            { cmd: 'delete-grades' },
            { classSubjectId: this.classSubject.id }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }
}