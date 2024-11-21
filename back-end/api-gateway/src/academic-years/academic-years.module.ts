import { Module } from "@nestjs/common";
import { RmqClientsModule } from "src/rmq-clients/rmq-clients.module";
import { AcademicYearsController } from "./academic-years.controller";
import { AcademicYearsService } from "./services/academic-year.service";
import { SemestersService } from "./services/semesters.service";

@Module({
    imports: [RmqClientsModule],
    controllers: [AcademicYearsController],
    providers: [
        AcademicYearsService,
        SemestersService
    ]
})
export class AcademicYearsModule {}