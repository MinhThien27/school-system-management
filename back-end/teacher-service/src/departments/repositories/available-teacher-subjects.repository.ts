import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DatabaseService } from "src/database/services/database.service";

@Injectable()
export class AvailableTeacherSubjectsRepository {

    constructor(private readonly databaseService: DatabaseService) {}

    async deleteAvailableTeacherSubjects(filterQuery: Prisma.AvailableTeacherSubjectWhereInput): Promise<Prisma.BatchPayload> {
        return await this.databaseService.availableTeacherSubject.deleteMany({
            where: filterQuery
        });
    }
}