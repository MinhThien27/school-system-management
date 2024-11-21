import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DatabaseModule } from "src/database/database.module";
import { SchoolConfiguration, SchoolConfigurationSchema } from "./schemas/school-configuration.schema";
import { SchoolConfigurationsController } from "./school-configurations.controller";
import { SchoolConfigurationsService } from "./services/school-configurations.service";
import { SchoolConfigurationsRepository } from "./repositories/school-configurations.repository";

@Module({
    imports: [
        forwardRef(() => DatabaseModule),
        MongooseModule.forFeature([{ name: SchoolConfiguration.name, schema: SchoolConfigurationSchema }])
    ],
    controllers: [SchoolConfigurationsController],
    providers: [
        SchoolConfigurationsService,
        SchoolConfigurationsRepository
    ],
    exports: [
        SchoolConfigurationsRepository
    ]
})
export class SchoolConfigurationsModule {}