import { Module } from "@nestjs/common";
import { RmqClientsModule } from "src/rmq-clients/rmq-clients.module";
import { SchoolConfigurationsController } from "./school-configurations.controller";
import { SchoolConfigurationsService } from "./services/school-configurations.service";

@Module({
    imports: [RmqClientsModule],
    controllers: [SchoolConfigurationsController],
    providers: [SchoolConfigurationsService]
})
export class SchoolConfigurationsModule {}