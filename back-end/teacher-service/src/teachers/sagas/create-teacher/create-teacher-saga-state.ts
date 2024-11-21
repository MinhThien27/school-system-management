import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { Teacher } from "src/teachers/types/teacher-custom.type";

export class CreateTeacherSagaState {

    private imageUrl: string;
    private role: string;

    constructor(
        private readonly teacherServiceClient: ClientProxy,
        private readonly imageServiceClient: ClientProxy,
        private readonly authServiceClient: ClientProxy,
        private readonly teacher: Teacher,
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

    async makeCancelCreateTeacherCommand() {
        await firstValueFrom(this.teacherServiceClient.send({ cmd: 'cancel-create-teacher' }, this.teacher.id).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }

    async makeSaveTeacherImageCommand() {
        const imageUrl = await firstValueFrom(this.imageServiceClient.send({ cmd: 'save-teacher-image' }, this.image).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        this.imageUrl = imageUrl;
    }

    makeDeleteTeacherImageCommand() {
        this.imageServiceClient.emit('delete-teacher-image', this.imageUrl);
    }

    async makeUpdateTeacherImageUrlCommand() {
        await firstValueFrom(this.teacherServiceClient.send({ cmd: 'update-teacher-image-url' }, { teacherId: this.teacher.id, imageUrl: this.imageUrl })
            .pipe(timeout({
                first: 10000,
                with: () => throwError(() => new RequestTimeoutRpcException())
            })));
    }

    async makeCreateUserAccountCommand() {
        const userAccount = await firstValueFrom(this.authServiceClient.send({ cmd: 'create-user-account' }, {
            _id: this.teacher.id,
            email: this.email,
            password: this.password,
            citizenIdentification: this.citizenIdentification,
            phoneNumber: this.phoneNumber,
            role: 'Teacher'
        }).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        this.role = userAccount.role;
    }
}