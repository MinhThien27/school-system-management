import { Module } from "@nestjs/common";
import { SubjectsController } from "./subjects.controller";
import { SubjectsService } from "./services/subjects.service";
import { SubjectsRepository } from "./repositories/subjects.repository";
import { DatabaseModule } from "src/database/database.module";
import { RmqClientsModule } from "src/rmq-clients/rmq-clients.module";
import { SubjectsFacade } from "./facades/subjects.facade";

@Module({
    imports: [
        DatabaseModule,
        RmqClientsModule
    ],
    controllers: [SubjectsController],
    providers: [
        SubjectsService,
        SubjectsFacade,
        SubjectsRepository
    ]
})
export class SubjectsModule {}