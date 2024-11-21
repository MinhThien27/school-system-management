import { Controller, UseFilters } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { CreateUserAccountDto } from "./dtos/create-user-account.dto";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UpdateUserAccountDto } from "./dtos/update-user-account.dto";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { AllExceptionsFilter } from "src/exception-filters";
import { FilterQuery } from "mongoose";
import { User } from "./schemas/user.schema.";
import { LoginDto } from "./dtos/login.dto";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { UserEntity } from "./entities/user.entity";

@Controller()
@UseFilters(AllExceptionsFilter)
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @MessagePattern({ cmd: 'login' })
    async login(
        @Payload('dto') loginDto: LoginDto
    ) {
        return this.authService.login(loginDto);
    }

    @MessagePattern({ cmd: 'refresh' })
    refresh(@Payload() refreshToken: string) {
        return this.authService.refresh(refreshToken);
    }

    @MessagePattern({ cmd: 'change-password' })
    changePassword(
        @Payload('user') user: UserEntity, 
        @Payload('dto') changePasswordDto: ChangePasswordDto
    ) {
        return this.authService.changePassword(user, changePasswordDto);
    }

    @MessagePattern({ cmd: 'get-user-accounts' })
    getUserAccounts(
        @Payload('pagination') pagination: Pagination,
        @Payload('sorts') sorts?: Sorting[],
        @Payload('filters') filters?: Filtering[]
    ) {
        return this.authService.getUserAccounts(pagination, sorts, filters);
    }

    @MessagePattern({ cmd: 'create-user-account' })
    createUserAccount(@Payload() createUserAccountDto: CreateUserAccountDto) {
        return this.authService.createUserAccount(createUserAccountDto);
    }

    @MessagePattern({ cmd: 'update-user-account' })
    updateUserAccount(@Payload() updateUserAccountDto: UpdateUserAccountDto) {
        return this.authService.updateUserAccount(updateUserAccountDto);
    }

    @MessagePattern({ cmd: 'delete-user-account' })
    deleteUserAccount(@Payload() userId: string) {
        return this.authService.deleteUserAccount(userId);
    }

    @MessagePattern({ cmd: 'get-user-account' })
    getUserAccount(@Payload() userId: string) {
        return this.authService.getUserAccount(userId);
    } 

    @MessagePattern({ cmd: 'get-user-account-with-filter-query' })
    getUserAccountWithFilterQuery(
        @Payload('filterQuery') filterQuery: FilterQuery<User>
    ) {
        return this.authService.getUserAccountWithFilterQuery(filterQuery);
    } 
}