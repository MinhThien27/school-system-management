import { Module } from "@nestjs/common";
import { StudentsController } from "./students.controller";
import { StudentsService } from "./services/students.service";
import { StudentsRepository } from "./repositories/students.repository";
import { DatabaseModule } from "src/database/database.module";
import { RmqClientsModule } from "src/rmq-clients/rmq-clients.module";
import { StudentSagaService } from "./services/student-saga.service";
import { StudentDetailService } from "./services/student-detail.service";
import { StudentDetailRepository } from "./repositories/student-detail.repository";
import { ParentsService } from "./services/parents.service";
import { ParentsRepository } from "./repositories/parents.repository";
import { GradesService } from "./services/grades.service";
import { GradesRepository } from "./repositories/grades.repository";
import { StudentsFacade } from "./facades/students.facade";
import { GradesFacade } from "./facades/grades.facade";

@Module({
    imports: [
        DatabaseModule,
        RmqClientsModule
    ],
    controllers: [StudentsController],
    providers: [
        StudentsService,
        StudentsFacade,
        StudentSagaService,
        StudentsRepository,
        StudentDetailService,
        StudentDetailRepository,
        ParentsService,
        ParentsRepository,
        GradesService,
        GradesFacade,
        GradesRepository
    ]
})
export class StudentsModule {}