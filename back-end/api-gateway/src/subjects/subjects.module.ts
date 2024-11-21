import { Module } from "@nestjs/common";
import { RmqClientsModule } from "src/rmq-clients/rmq-clients.module";
import { SubjectsController } from "./subjects.controller";
import { SubjectsService } from "./services/subjects.service";

@Module({
    imports: [RmqClientsModule],
    controllers: [SubjectsController],
    providers: [SubjectsService]
})
export class SubjectsModule {}