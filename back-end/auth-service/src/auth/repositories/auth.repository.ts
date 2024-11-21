import { Injectable } from "@nestjs/common";
import { CreateUserAccountDto } from "../dtos/create-user-account.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../schemas/user.schema.";
import { FilterQuery, Model } from "mongoose";
import { UpdateUserAccountDto } from "../dtos/update-user-account.dto";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { getOrder, getWhere } from "src/helpers/mongoose.helper";

@Injectable()
export class AuthRepository {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) { }

    async findUserAccounts(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<User[]> {
        const userAccounts = await this.userModel
            .find(getWhere(filters))
            .limit(pagination.limit)
            .skip(pagination.offset)
            .sort(getOrder(sorts))
            .lean()
            .exec();
        return userAccounts;
    }
    
    async findUserAccountById(id: string): Promise<User> {
        const userAccount = await this.userModel.findById(id).lean().exec();
        return userAccount;
    }

    async findUserAccountWithFilterQuery(filterQuery: FilterQuery<User>): Promise<User> {
        const userAccount = await this.userModel.findOne(filterQuery).lean().exec();
        return userAccount;
    }

    async createUserAccount(createUserAccountDto: CreateUserAccountDto): Promise<User> {
        const createdUserAccount = await this.userModel.create(createUserAccountDto);
        return createdUserAccount.toObject();
    }

    async updateUserAccount(userId: string, updateUserAccountDto: Omit<UpdateUserAccountDto, '_id'>): Promise<User> {
        const udpatedUserAccount = await this.userModel.findByIdAndUpdate(userId, updateUserAccountDto, { new: true });
        return udpatedUserAccount.toObject();
    }

    async updateUserAccountForChangePassword(userId: string, updateUserAccountDto: Partial<Omit<CreateUserAccountDto, '_id' | 'role'>>): Promise<User> {
        const udpatedUserAccount = await this.userModel.findByIdAndUpdate(userId, updateUserAccountDto, { new: true });
        return udpatedUserAccount.toObject();
    }

    async deleteUserAccount(userId: string): Promise<User> {
        const deletedUserAccount = await this.userModel.findByIdAndDelete(userId);
        return deletedUserAccount.toObject();
    }
}