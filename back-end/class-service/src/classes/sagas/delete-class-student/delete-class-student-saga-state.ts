import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { ClassStudent } from "src/classes/types/class-student-custom.type";
import { RequestTimeoutRpcException } from "src/exceptoins";

export class DeleteClassStudentSagaState {

    constructor(
        private readonly studentServiceClient: ClientProxy,
        private readonly classSudent: ClassStudent
    ) { }

    async makeDeleteGradesCommand() {
        console.log('Run makeDeleteGradesCommand')
        await firstValueFrom(this.studentServiceClient.send(
            { cmd: 'delete-grades' },
            {
                filterQuery: { studentId: this.classSudent.studentId }
            }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }
}