import { ClientProxy } from "@nestjs/microservices";
import { Student } from "@prisma/client";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";

export class DeleteStudentSagaState {

    private role: string;
    private email: string;
    private citizenIdentification: string;
    private phoneNumber: string;

    constructor(
        private readonly studentServiceClient: ClientProxy,
        private readonly imageServiceClient: ClientProxy,
        private readonly authServiceClient: ClientProxy,
        private readonly classServiceClient: ClientProxy,
        private readonly student: Student
    ) { }

    getRole(): string {
        return this.role;
    }

    getEmail(): string {
        return this.email;
    }

    getCitizenIdentification(): string {
        return this.citizenIdentification;
    }

    getPhoneNumber(): string {
        return this.phoneNumber;
    }

    async makeCancelDeleteStudentCommand() {
        console.log('Run makeCancelDeleteStudentCommand')
        await firstValueFrom(this.studentServiceClient.send(
            { cmd: 'cancel-delete-student' }, 
            { ...this.student }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async makeDeleteUserAccountCommand() {
        console.log('Run makeDeleteUserAccountCommand')
        const userAccount = await firstValueFrom(this.authServiceClient.send(
            { cmd: 'delete-user-account' },
            this.student.id,
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        this.email = userAccount.email;
        this.role = userAccount.role;
        this.citizenIdentification = userAccount.citizenIdentification;
        this.phoneNumber = userAccount.phoneNumber;
    }

    async makeDeleteClassStudentsCommand() {
        console.log('Run makeDeleteClassStudentsCommand')
        await firstValueFrom(this.classServiceClient.send(
            { cmd: 'delete-class-students' }, 
            { studentId: this.student.id }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    makeDeleteStudentImageCommand() {
        console.log('Run makeDeleteStudentImageCommand')
        this.imageServiceClient.emit('delete-student-image', this.student.imageUrl);
    }
}