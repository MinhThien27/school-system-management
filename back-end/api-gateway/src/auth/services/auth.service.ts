import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { throwError, timeout } from "rxjs";
import { LoginDto } from "../dtos/login.dto";
import { ChangePasswordDto } from "../dtos/change-password.dto";
import { UserEntity } from "../entities/user.entity";

@Injectable()
export class AuthService {
    
    constructor(@Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy) {}

    login(loginDto: LoginDto) {
        return this.authServiceClient.send({ cmd: 'login' }, { dto: loginDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    refresh(refreshToken: string) {
        refreshToken = refreshToken ? refreshToken : '';
        return this.authServiceClient.send({ cmd: 'refresh' }, refreshToken)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    changePassword(user: UserEntity, changePasswordDto: ChangePasswordDto) {
        return this.authServiceClient.send({ cmd: 'change-password' }, { user, dto: changePasswordDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}