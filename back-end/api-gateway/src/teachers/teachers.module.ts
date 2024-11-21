import { Module } from "@nestjs/common";
import { RmqClientsModule } from "src/rmq-clients/rmq-clients.module";
import { TeachersController } from "./teachers.controller";
import { TeachersService } from "./services/teachers.service";
import { TeacherClassSubjectsService } from "./services/teacher-class-subjects.service";
import { AvailableTeacherSubjectsService } from "./services/available-teacher-subjects.service";

@Module({
    imports: [RmqClientsModule],
    controllers: [TeachersController],
    providers: [
        TeachersService,
        TeacherClassSubjectsService,
        AvailableTeacherSubjectsService
    ]
})
export class TeachersModule {}