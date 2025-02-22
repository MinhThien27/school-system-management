import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
    
    private readonly logger = new Logger(DatabaseService.name);

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Connected to PostgreSql')
        } catch (err) {
            this.logger.error(err);
        }
    }
}