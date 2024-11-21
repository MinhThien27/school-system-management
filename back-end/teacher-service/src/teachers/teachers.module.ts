import { forwardRef, Module } from "@nestjs/common";
import { TeachersController } from "./teachers.controller";
import { TeachersService } from "./services/teachers.service";
import { DatabaseModule } from "src/database/database.module";
import { RmqClientsModule } from "src/rmq-clients/rmq-clients.module";
import { TeacherSagaService } from "./services/teacher-saga.service";
import { TeachersRepository } from "./repositories/teachers.repository";
import { TeacherClassSubjectsService } from "./services/teacher-class-subjects.service";
import { TeacherClassSubjectsRepository } from "./repositories/teacher-class-subjects.repository";
import { DepartmentsModule } from "src/departments/departments.module";
import { TeachersFacade } from "./facades/teachers.facade";
import { TeacherClassSubjectsFacade } from "./facades/teachers-class-subjects.facade";
import { AvailableTeacherSubjectsSevrice } from "./services/available-teacher-subjects.service";
import { AvailableTeacherSubjectsRepository } from "./repositories/available-teacher-subjects.repository";

@Module({
    imports: [
        DatabaseModule,
        RmqClientsModule,
        forwardRef(() => DepartmentsModule)
    ],
    controllers: [TeachersController],
    providers: [
        TeachersService,
        TeachersFacade,
        TeacherSagaService,
        TeachersRepository,
        TeacherClassSubjectsService,
        TeacherClassSubjectsFacade,
        TeacherClassSubjectsRepository,
        AvailableTeacherSubjectsSevrice,
        AvailableTeacherSubjectsRepository
    ],
    exports: [TeachersRepository]
})
export class TeachersModule {}