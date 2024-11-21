import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { AuthRepository } from "src/auth/repositories/auth.repository";
import { randomUUID } from 'crypto'
import { hash } from "bcrypt";

@Injectable()
export class DatabaseService implements OnModuleInit {

    private readonly logger = new Logger(DatabaseService.name);

    constructor(
        private readonly authRepository: AuthRepository
    ) { }

    async onModuleInit() {
        await this.seedData();
    }

    private async seedData() {
        const adminAccount = await this.authRepository.findUserAccountWithFilterQuery({ role: 'Admin' });
        const hashPassword = await hash('123456', 10);
        if (!adminAccount) {
            await this.authRepository.createUserAccount({
                _id: randomUUID(),
                email: 'admin@gmail.com',
                password: hashPassword,
                role: 'Admin'
            });
            this.logger.log('Default data seeded');
        }
    }
}