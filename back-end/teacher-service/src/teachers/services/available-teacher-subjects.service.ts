import { Injectable } from "@nestjs/common";
import { AvailableTeacherSubjectsRepository } from "../repositories/available-teacher-subjects.repository";
import { Filtering, PaginatedResource, Pagination, Sorting } from "src/interfaces";
import { AvailableTeacherSubject } from "../types/available-teacher-subject-custom.type";
import { Prisma } from "@prisma/client";

@Injectable()
export class AvailableTeacherSubjectsSevrice {

    constructor(private readonly availableTeacherSubjectsRepository: AvailableTeacherSubjectsRepository) {}

    async getAvailableTeacherSubjects(
        teacherId: string, 
        pagination: Pagination, 
        sorts?: Sorting[], 
        filters?: Filtering[]
    ): Promise<PaginatedResource<AvailableTeacherSubject>> {
        const availableTeacherubjects = await this.availableTeacherSubjectsRepository.findAvailableTeacherSubjects(teacherId, pagination, sorts, filters);
        const availableTeacherubjectCount = await this.availableTeacherSubjectsRepository.countAvailableTeacherSubjects({
            departmentTeacher: {
                teacher: {
                    id: teacherId
                }
            }
        });
        return {
            totalItems: availableTeacherubjectCount,
            items: availableTeacherubjects,
            page: pagination.page,
            size: pagination.size
        };
    }

    getAvailableTeacherSubjectsWithFilterQuery(
        filterQuery: Prisma.AvailableTeacherSubjectWhereInput
    ): Promise<AvailableTeacherSubject[]> {
        return this.availableTeacherSubjectsRepository.findAvailableTeacherSubjectsWithFilterQuery(filterQuery);
    }
}