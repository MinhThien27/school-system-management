import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { Student } from "src/students/types/student-custom.type";

export class UpdateStudentSagaState {

    private newImageUrl: string;

    constructor(
        private readonly studentServiceClient: ClientProxy,
        private readonly imageServiceClient: ClientProxy,
        private readonly authServiceClient: ClientProxy,
        private readonly oldStudent: Student,
        private readonly student: Student,
        private email?: string,
        private citizenIdentification?: string,
        private phoneNumber?: string,
        private role?: string,
        private readonly image?: Express.Multer.File
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

    getNewImageUrl(): string {
        return this.newImageUrl;
    }

    async makeCancelUpdateStudentCommand() {
        console.log('Run makeCancelUpdateStudentCommand')
        await firstValueFrom(this.studentServiceClient.send(
            { cmd: 'cancel-update-student' }, 
            { ...this.oldStudent }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async makeSaveStudentImageCommand() {
        if (this.image) {
            console.log('Run makeSaveStudentImageCommand')
            const newImageUrl = await firstValueFrom(this.imageServiceClient.send(
                { cmd: 'save-student-image' }, 
                this.image
            ).pipe(timeout({
                first: 10000,
                with: () => throwError(() => new RequestTimeoutRpcException())
            })));
            this.newImageUrl = newImageUrl;
        }
    }

    makeDeleteStudentImageCommand() {
        if (this.image) {
            console.log('Run makeDeleteStudentImageCommand')
            this.imageServiceClient.emit('delete-student-image', this.newImageUrl);
        }
    }

    async makeUpdateStudentImageUrlCommand() {
        if (this.image) {
            console.log('Run makeUpdateStudentImageUrlCommand')
            await firstValueFrom(this.studentServiceClient.send(
                { cmd: 'update-student-image-url' },
                { studentId: this.student.id, imageUrl: this.newImageUrl }
            ).pipe(timeout({
                first: 10000,
                with: () => throwError(() => new RequestTimeoutRpcException())
            })));
        }
    }

    async makeUpdateUserAccountCommand() {
        if (this.email || this.role || this.citizenIdentification || this.phoneNumber) {
            console.log('Run makeUpdateUserAccountCommand')
            const userAccount = await firstValueFrom(this.authServiceClient.send(
                { cmd: 'update-user-account' },
                {
                    _id: this.student.id,
                    email: this.email,
                    citizenIdentification: this.citizenIdentification,
                    phoneNumber: this.phoneNumber,
                    role: this.role
                }
            ).pipe(timeout({
                first: 10000,
                with: () => throwError(() => new RequestTimeoutRpcException())
            })));
            this.role = userAccount.role;
            this.email = userAccount.email;
            this.citizenIdentification = userAccount.citizenIdentification;
            this.phoneNumber = userAccount.phoneNumber;
        }
    }

    makeDeleteOldStudentImageCommand() {
        if (this.image) {
            console.log('Run makeDeleteOldStudentImageCommand')
            this.imageServiceClient.emit('delete-student-image', this.oldStudent.imageUrl);
        }
    }
}