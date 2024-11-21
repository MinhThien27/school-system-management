import { Module } from "@nestjs/common";
import { RmqClientsModule } from "src/rmq-clients/rmq-clients.module";
import { LevelsController } from "./levels.controller";
import { LevelsService } from "./services/levels.service";
import { LevelSubjectsService } from "./services/level-subjects.service";

@Module({
    imports: [RmqClientsModule],
    controllers: [LevelsController],
    providers: [
        LevelsService,
        LevelSubjectsService
    ]
})
export class LevelsModule {}