import { Module } from "@nestjs/common";
import { DepartmentsController } from "./departments.controller";
import { DepartmentsService } from "./services/departments.service";
import { RmqClientsModule } from "src/rmq-clients/rmq-clients.module";
import { DepartmentSubjectsService } from "./services/department-subjects.service";
import { DepartmentTeachersService } from "./services/department-teachers.service";

@Module({
    imports: [RmqClientsModule],
    controllers: [DepartmentsController],
    providers: [
        DepartmentsService,
        DepartmentSubjectsService,
        DepartmentTeachersService
    ]
})
export class DepartmentsModule {}