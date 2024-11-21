import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { ClassesController } from "./classes.controller";
import { ClassesService } from "./services/classes.service";
import { ClassesRepository } from "./repositories/classes.repository";
import { RmqClientsModule } from "src/rmq-clients/rmq-clients.module";
import { ClassSubjectsService } from "./services/class-subjects.service";
import { ClassSubjectsRepository } from "./repositories/class-subjects.repository";
import { ClassStudentsService } from "./services/class-students.service";
import { ClassStudentsRepository } from "./repositories/class-students.repository";
import { ClassSubjectSagaService } from "./services/class-subject-saga.service";
import { ClassStudentSagaService } from "./services/class-student-saga.service";
import { ClassesFacade } from "./facades/classes.facade";
import { ClassSubjectsFacade } from "./facades/class-subjects.facade";
import { ClassStudentsFacade } from "./facades/class-students.facade";
import { GradesService } from "./services/grades.service";

@Module({
    imports: [
        DatabaseModule,
        RmqClientsModule
    ],
    controllers: [ClassesController],
    providers: [
        ClassesService,
        ClassesFacade,
        ClassesRepository,
        ClassSubjectsService,
        ClassSubjectsFacade,
        ClassSubjectsRepository,
        ClassStudentsService,
        ClassStudentsFacade,
        ClassStudentsRepository,
        ClassSubjectSagaService,
        ClassStudentSagaService,
        GradesService
    ]
})
export class ClassesModule {}