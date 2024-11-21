import { ClientProxy } from "@nestjs/microservices";
import { Teacher } from "@prisma/client";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";

export class UpdateTeacherSagaState {

    private newImageUrl: string;

    constructor(
        private readonly teacherServiceClient: ClientProxy,
        private readonly imageServiceClient: ClientProxy,
        private readonly authServiceClient: ClientProxy,
        private readonly oldTeacher: Teacher,
        private readonly teacher: Teacher,
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

    async makeCancelUpdateTeacherCommand() {
        console.log('Run makeCancelUpdateTeacherCommand')
        await firstValueFrom(this.teacherServiceClient.send(
            { cmd: 'cancel-update-teacher' }, 
            { ...this.oldTeacher }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async makeSaveTeacherImageCommand() {
        if (this.image) {
            console.log('Run makeSaveTeacherImageCommand')
            const newImageUrl = await firstValueFrom(this.imageServiceClient.send(
                { cmd: 'save-teacher-image' }, 
                this.image
            ).pipe(timeout({
                first: 10000,
                with: () => throwError(() => new RequestTimeoutRpcException())
            })));
            this.newImageUrl = newImageUrl;
        }
    }

    makeDeleteTeacherImageCommand() {
        if (this.image) {
            console.log('Run makeDeleteTeacherImageCommand')
            this.imageServiceClient.emit('delete-teacher-image', this.newImageUrl);
        }
    }

    async makeUpdateTeacherImageUrlCommand() {
        if (this.image) {
            console.log('Run makeUpdateTeacherImageUrlCommand')
            await firstValueFrom(this.teacherServiceClient.send(
                { cmd: 'update-teacher-image-url' },
                { teacherId: this.teacher.id, imageUrl: this.newImageUrl }
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
                    _id: this.teacher.id,
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

    makeDeleteOldTeacherImageCommand() {
        if (this.image) {
            console.log('Run makeDeleteOldTeacherImageCommand')
            this.imageServiceClient.emit('delete-teacher-image', this.oldTeacher.imageUrl);
        }
    }
}