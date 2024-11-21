import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { RmqClientsModule } from "src/rmq-clients/rmq-clients.module";
import { AcademicYearsController } from "./academic-years.controller";
import { AcademicYearsService } from "./services/academic-years.service";
import { AcademicYearsRepository } from "./repositories/academic-year.repository";

@Module({
    imports: [
        DatabaseModule,
        RmqClientsModule
    ],
    controllers: [AcademicYearsController],
    providers: [
        AcademicYearsService,
        AcademicYearsRepository
    ],
    exports: [AcademicYearsRepository]
})  
export class AcademicYearsModule {}