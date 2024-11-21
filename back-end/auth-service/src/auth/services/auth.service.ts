import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "../repositories/auth.repository";
import { CreateUserAccountDto } from "../dtos/create-user-account.dto";
import { User } from "../schemas/user.schema.";
import { hash } from "bcrypt";
import { UpdateUserAccountDto } from "../dtos/update-user-account.dto";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { FilterQuery } from "mongoose";
import { LoginDto } from "../dtos/login.dto";
import { compare } from "bcrypt";
import { UnauthorizedRpcException } from "src/exceptoins/unauthorized-rpc.exception";
import { sign, verify } from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { UserEntity } from "../entities/user.entity";
import { ChangePasswordDto } from "../dtos/change-password.dto";

@Injectable()
export class AuthService {

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly configService: ConfigService,
        @Inject('STUDENT_SERVICE') private readonly studentServiceClient: ClientProxy,
        @Inject('TEACHER_SERVICE') private readonly teacherServiceClient: ClientProxy
    ) {}

    async login(loginDto: LoginDto): Promise<{ accessToken: string, refreshToken: string }> {
        const user = await this.authRepository.findUserAccountWithFilterQuery({
            email: loginDto.email
        });
        if (!user) throw new UnauthorizedRpcException(); // !user || !user.status
        const match = await compare(loginDto.password, user.password);
        if (!match) throw new UnauthorizedRpcException();
        let userInfo: Record<string, any>;
        try {
            if (user.role === 'Student') {
                userInfo = await firstValueFrom(this.studentServiceClient.send(
                    { cmd: 'get-student' },
                    user._id
                ));
            }
            if (user.role === 'Teacher') {
                userInfo = await firstValueFrom(this.teacherServiceClient.send(
                    { cmd: 'get-teacher' },
                    user._id
                ));
            }
        } catch (err) { }
        const accessToken = sign(
            {
                UserInfo: {
                    id: user._id,
                    firstName: userInfo ? userInfo.firstName : undefined,
                    lastName: userInfo ? userInfo.lastName : undefined,
                    email: user.email,
                    role: user.role,
                    avatar: userInfo ? userInfo.imageUrl : undefined
                }
            },
            this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            { expiresIn: user.role === 'Admin' ?  '1d' : '60m' }
        );
        const refreshToken = sign(
            { id: user._id },
            this.configService.get<string>('REFRESH_TOKEN_SECRET'),
            { expiresIn: '7d' }
        );
        return { accessToken, refreshToken };
    }

    async refresh(refreshToken: string): Promise<{ accessToken: string }> {
        if (!refreshToken) throw new UnauthorizedRpcException();
        let decoded: any;
        try {
            decoded = await new Promise<any>((resolve, reject) => {
                verify(
                    refreshToken,
                    this.configService.get<string>('REFRESH_TOKEN_SECRET'),
                    async (err: any, decoded: any) => {
                        if (err) reject(err);
                        resolve(decoded)
                    }
                )
            });
        } catch (err) {
            throw new UnauthorizedRpcException();
        }
        const foundUser = await this.authRepository.findUserAccountById(decoded.id);
        if (!foundUser) throw new UnauthorizedException();
        let userInfo: Record<string, any>;
        try {
            if (foundUser.role === 'Student') {
                userInfo = await firstValueFrom(this.studentServiceClient.send(
                    { cmd: 'get-student' },
                    foundUser._id
                ));
            }
            if (foundUser.role === 'Teacher') {
                userInfo = await firstValueFrom(this.teacherServiceClient.send(
                    { cmd: 'get-teacher' },
                    foundUser._id
                ));
            }
        } catch (err) { }
        const accessToken = sign(
            {
                UserInfo: {
                    id: foundUser._id,
                    firstName: userInfo ? userInfo.firstName : undefined,
                    lastName: userInfo ? userInfo.lastName : undefined,
                    email: foundUser.email,
                    role: foundUser.role,
                    avatar: userInfo ? userInfo.imageUrl : undefined
                }
            },
            this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            { expiresIn: foundUser.role === 'Admin' ?  '1d' : '60m' }
        );
        return { accessToken };
    }

    async changePassword(user: UserEntity, { oldPassword, newPassword }: ChangePasswordDto): Promise<{ message: string }> {
        const userAccount = await this.authRepository.findUserAccountById(user.id);
        const match = await compare(oldPassword, userAccount.password);
        if (!match) throw new UnauthorizedRpcException();
        const hashNewPassword = await hash(newPassword, 10);
        await this.authRepository.updateUserAccountForChangePassword(user.id, { password: hashNewPassword });
        return {
            message: 'Change password success'
        }
    }

    getUserAccounts(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<User[]> {
        return this.authRepository.findUserAccounts(pagination, sorts, filters);
    }

    async createUserAccount(createUserAccountDto: CreateUserAccountDto): Promise<User> {
        const hashPassword = await hash(createUserAccountDto.password, 10);
        createUserAccountDto.password = hashPassword;
        return this.authRepository.createUserAccount(createUserAccountDto);
    }

    updateUserAccount(updateUserAccountDto: UpdateUserAccountDto): Promise<User> {
        const { _id, ...updateUserAccountDtoWithoutId } = updateUserAccountDto;
        return this.authRepository.updateUserAccount(_id, updateUserAccountDtoWithoutId);
    }

    deleteUserAccount(userId: string): Promise<User> {
        return this.authRepository.deleteUserAccount(userId)
    }

    getUserAccount(userId: string): Promise<User> {
        return this.authRepository.findUserAccountById(userId);
    }

    getUserAccountWithFilterQuery(filterQuery: FilterQuery<User>): Promise<User> {
        return this.authRepository.findUserAccountWithFilterQuery(filterQuery);
    }
}