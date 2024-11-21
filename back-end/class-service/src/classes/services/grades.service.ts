import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { PaginatedResource, Pagination } from "src/interfaces";
import { UpdateGradesDto } from "../dtos/update-grades.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class GradesService {

    constructor(
        @Inject('STUDENT_SERVICE') private readonly studentServiceClient: ClientProxy
    ) {}

    async getGradesOfClassSubject(
        classSubjectId: string,
        pagination: Pagination
    ): Promise<PaginatedResource<Record<string, any>>> {
        const gradesOfClassSubject: Record<string, any>[] = await firstValueFrom(this.studentServiceClient.send(
            { cmd: 'get-grades-with-filter-query' },
            {
                filterQuery: { classSubjectId }
            }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));

        return {
            totalItems: gradesOfClassSubject.length,
            items: gradesOfClassSubject.slice(pagination.offset, pagination.offset + pagination.limit),
            page: pagination.page,
            size: pagination.size
        };
    }

    async updateGradesOfClassSubject(
        classSubjectId: string,
        updateGradesDto: UpdateGradesDto
    ): Promise<Prisma.BatchPayload> {
        const { gradesDto } = updateGradesDto;
        if (gradesDto && gradesDto.length) {
            for (const gradeDto of gradesDto) {
                const { studentId, updateGradeDto } = gradeDto;
                await firstValueFrom(this.studentServiceClient.send(
                    { cmd: 'update-grade-with-filter-query' },
                    {
                        filterQuery: {
                            classSubjectId_studentId: {
                                classSubjectId,
                                studentId
                            }
                        },
                        dto: updateGradeDto
                    }
                ).pipe(timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutRpcException())
                })));
            }
        };
        return { count: gradesDto.length };
    }
}