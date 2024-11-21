import { Module } from "@nestjs/common";
import { RmqClientsModule } from "src/rmq-clients/rmq-clients.module";
import { ClassesController } from "./classes.controller";
import { ClassesService } from "./services/classes.service";
import { ClassSubjectsService } from "./services/class-subjects.service";
import { ClassStudentsService } from "./services/class-students.service";
import { GradesService } from "./services/grades.service";

@Module({
    imports: [RmqClientsModule],
    controllers: [ClassesController],
    providers: [
        ClassesService,
        ClassSubjectsService,
        ClassStudentsService,
        GradesService
    ]
})
export class ClassesModule {}