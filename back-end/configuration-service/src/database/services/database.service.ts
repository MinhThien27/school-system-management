import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { SchoolConfigurationsRepository } from "src/school-configurations/repositories/school-configurations.repository";

@Injectable()
export class DatabaseService implements OnModuleInit {

    private readonly logger = new Logger(DatabaseService.name);

    constructor(
        private readonly schoolConfigurationsRepository: SchoolConfigurationsRepository
    ) { }

    async onModuleInit() {
        await this.seedData();
    }

    private async seedData() {
        const count = await this.schoolConfigurationsRepository.countDocuments();
        if (count === 0) {
            await this.schoolConfigurationsRepository.createSchoolConfiguration({});
            this.logger.log('Default data seeded');
        }
    }
}