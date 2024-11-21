import { forwardRef, Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { DepartmentsController } from "./departments.controller";
import { DepartmentsService } from "./services/departments.service";
import { DepartmentsRepository } from "./repositories/departments.repository";
import { RmqClientsModule } from "src/rmq-clients/rmq-clients.module";
import { TeachersModule } from "src/teachers/teachers.module";
import { DepartmentSubjectsService } from "./services/department-subjects.service";
import { DepartmentSubjectsRepository } from "./repositories/department-subjects.repository";
import { DepartmentTeachersService } from "./services/department-teachers.service";
import { DepartmentTeachersRepository } from "./repositories/department-teachers.repository";
import { AvailableTeacherSubjectsRepository } from "./repositories/available-teacher-subjects.repository";
import { DepartmentsFacade } from "./facades/departments.facade";
import { DepartmentTeachersFacade } from "./facades/department-teachers.facade";
import { DepartmentSubjectsFacade } from "./facades/department-subjects.facade";

@Module({
    imports: [
        DatabaseModule,
        RmqClientsModule,
        forwardRef(() => TeachersModule)
    ],
    controllers: [DepartmentsController],
    providers: [
        DepartmentsService,
        DepartmentsFacade,
        DepartmentsRepository,
        DepartmentSubjectsService,
        DepartmentSubjectsFacade,
        DepartmentSubjectsRepository,
        DepartmentTeachersService,
        DepartmentTeachersFacade,
        DepartmentTeachersRepository,
        AvailableTeacherSubjectsRepository
    ],
    exports: [
        DepartmentSubjectsRepository,
        DepartmentTeachersRepository
    ]
})
export class DepartmentsModule {}