import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { ClassStudent } from "src/classes/types/class-student-custom.type";
import { ClassSubject } from "src/classes/types/class-subject-custom.type";
import { RequestTimeoutRpcException } from "src/exceptoins";

export class CreateClassSubjectSagaState {

    constructor(
        private readonly classServiceClient: ClientProxy,
        private readonly studentServiceClient: ClientProxy,
        private readonly classSubject: ClassSubject,
        private readonly classStudents: ClassStudent[]
    ) { }

    async makeCancelCreateClassSubjectCommand() {
        console.log('run makeCancelCreateClassSubjectCommand');
        await firstValueFrom(this.classServiceClient.send(
            { cmd: 'cancel-create-class-subject' }, 
            this.classSubject.id
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async makeCreateGradesCommand() {
        console.log('run makeCreateGradesCommand');
        const studentIds = this.classStudents.map(classStudent => classStudent.studentId);
        const dto = {
            createGradeForClassSubjectDto: {
                studentIds,
                classSubjectId: this.classSubject.id
            }
        }
        await firstValueFrom(this.studentServiceClient.send(
            { cmd: 'create-grades' }, 
            { dto }
        ));
    }
}