import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { Student } from "src/students/types/student-custom.type";

export class CreateStudentSagaState {

    private imageUrl: string;
    private role: string;

    constructor(
        private readonly studentServiceClient: ClientProxy,
        private readonly imageServiceClient: ClientProxy,
        private readonly authServiceClient: ClientProxy,
        private readonly student: Student,
        private readonly email: string,
        private readonly password: string,
        private readonly citizenIdentification: string,
        private readonly phoneNumber: string,
        private readonly image: Express.Multer.File
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

    getImageUrl(): string {
        return this.imageUrl;
    }

    async makeCancelCreateStudentCommand() {
        await firstValueFrom(this.studentServiceClient.send({ cmd: 'cancel-create-student' }, this.student.id).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async makeSaveStudentImageCommand() {
        const imageUrl = await firstValueFrom(this.imageServiceClient.send({ cmd: 'save-student-image' }, this.image).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        this.imageUrl = imageUrl;
    }

    makeDeleteStudentImageCommand() {
        this.imageServiceClient.emit('delete-student-image', this.imageUrl);
    }

    async makeUpdateStudentImageUrlCommand() {
        await firstValueFrom(this.studentServiceClient.send({ cmd: 'update-student-image-url' }, { studentId: this.student.id, imageUrl: this.imageUrl })
            .pipe(timeout({
                first: 10000,
                with: () => throwError(() => new RequestTimeoutRpcException())
            })));
    }

    async makeCreateUserAccountCommand() {
        const userAccount = await firstValueFrom(this.authServiceClient.send({ cmd: 'create-user-account' }, {
            _id: this.student.id,
            email: this.email,
            password: this.password,
            citizenIdentification: this.citizenIdentification,
            phoneNumber: this.phoneNumber,
            role: 'Student'
        }).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        this.role = userAccount.role;
    }
}