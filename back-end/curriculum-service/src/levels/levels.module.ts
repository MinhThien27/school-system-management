import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { LevelsController } from "./levels.controller";
import { LevelsService } from "./services/levels.service";
import { LevelsRepository } from "./repositories/levels.repository";
import { RmqClientsModule } from "src/rmq-clients/rmq-clients.module";
import { LevelSubjectsService } from "./services/level-subjects.service";
import { LevelSubjectsRepository } from "./repositories/level-subjects.repository";
import { LevelSubjectsFacade } from "./facades/level-subjects.facade";

@Module({
    imports: [
        DatabaseModule,
        RmqClientsModule
    ],
    controllers: [LevelsController],
    providers: [
        LevelsService,
        LevelsRepository,
        LevelSubjectsService,
        LevelSubjectsFacade,
        LevelSubjectsRepository
    ]
})
export class LevelsModule {}