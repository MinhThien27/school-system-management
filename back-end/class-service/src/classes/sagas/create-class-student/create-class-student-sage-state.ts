import { ClientProxy } from "@nestjs/microservices";
import { ClassStudent, ClassSubject } from "@prisma/client";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";

export class CreateClassStudentSagaState {

    constructor(
        private readonly classServiceClient: ClientProxy,
        private readonly studentServiceClient: ClientProxy,
        private readonly classStudent: ClassStudent,
        private readonly classSubjects: ClassSubject[]
    ) { }

    async makeCancelCreateClassStudentCommand() {
        console.log('run makeCancelCreateClassStudentCommand');
        await firstValueFrom(this.classServiceClient.send(
            { cmd: 'cancel-create-class-student' },
            this.classStudent.id
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async makeCreateGradesCommand() {
        console.log('run makeCreateGradesCommand');
        const classSubjectIds = this.classSubjects.map(classSubject => classSubject.id);
        const dto = {
            createGradeForClassStudentDto: {
                classSubjectIds,
                studentId: this.classStudent.studentId
            }
        }
        await firstValueFrom(this.studentServiceClient.send(
            { cmd: 'create-grades' },
            { dto }
        ));
    }
}