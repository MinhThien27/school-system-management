import { Module } from "@nestjs/common";
import { StudentsController } from "./students.controller";
import { StudentsService } from "./services/students.service";
import { RmqClientsModule } from "src/rmq-clients/rmq-clients.module";
import { StudentDetailService } from "./services/student-detail.service";
import { ParentsService } from "./services/parents.service";
import { GradesService } from "./services/grades.service";

@Module({
    imports: [RmqClientsModule],
    controllers: [StudentsController],
    providers: [
        StudentsService,
        StudentDetailService,
        ParentsService,
        GradesService
    ]
})
export class StudentsModule {}