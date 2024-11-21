import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { SemestersController } from "./semesters.controller";
import { SemestersService } from "./services/semesters.service";
import { SemestersRepository } from "./repositories/semesters.repository";
import { AcademicYearsModule } from "src/academic-years/academic-years.module";

@Module({
    imports: [
        DatabaseModule,
        AcademicYearsModule
    ],
    controllers: [SemestersController],
    providers: [
        SemestersService,
        SemestersRepository
    ]
})
export class SemestersModule {}