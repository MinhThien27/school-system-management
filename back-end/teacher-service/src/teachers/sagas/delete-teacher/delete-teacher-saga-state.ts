import { ClientProxy } from "@nestjs/microservices";
import { Teacher } from "@prisma/client";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";

export class DeleteTeacherSagaState {

    private role: string;
    private email: string;
    private citizenIdentification: string;
    private phoneNumber: string;

    constructor(
        private readonly teacherServiceClient: ClientProxy,
        private readonly imageServiceClient: ClientProxy,
        private readonly authServiceClient: ClientProxy,
        private readonly classServiceClient: ClientProxy,
        private readonly teacher: Teacher
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

    async makeCancelDeleteTeacherCommand() {
        console.log('Run makeCancelDeleteTeacherCommand')
        await firstValueFrom(this.teacherServiceClient.send(
            { cmd: 'cancel-delete-teacher' }, 
            { ...this.teacher }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async makeDeleteUserAccountCommand() {
        console.log('Run makeDeleteUserAccountCommand')
        const userAccount = await firstValueFrom(this.authServiceClient.send(
            { cmd: 'delete-user-account' },
            this.teacher.id,
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        this.email = userAccount.email;
        this.role = userAccount.role;
        this.citizenIdentification = userAccount.citizenIdentification;
        this.phoneNumber = userAccount.phoneNumber;
    }

    async makeDeleteClassesCommand() {
        console.log('Run makeDeleteClassesCommand')
        await firstValueFrom(this.classServiceClient.emit(
            { cmd: 'delete-classes' }, 
            { formTeacherId: this.teacher.id }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    makeDeleteTeacherImageCommand() {
        console.log('Run makeDeleteTeacherImageCommand')
        this.imageServiceClient.emit('delete-teacher-image', this.teacher.imageUrl);
    }
}