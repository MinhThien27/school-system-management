import { HttpStatus, Injectable } from "@nestjs/common";
import { SemestersRepository } from "../repositories/semesters.repository";
import { CreateSemesterDto } from "../dtos/create-semester.dto";
import { Semester } from "../types/semester-custom.type";
import { UpdateSemesterDto } from "../dtos/update-semester.dto";
import { Filtering, PaginatedResource, Pagination, Sorting } from "src/interfaces";
import { AcademicYear } from "src/academic-years/types/academic-year-custom.type";
import { RpcException } from "@nestjs/microservices";
import { Prisma } from "@prisma/client";

@Injectable()
export class SemestersService {
    
    constructor(
        private readonly semestersRepository: SemestersRepository
    ) {}

    countSemesters(academicYearId: string): Promise<number> {
        return this.semestersRepository.countSemesters({ academicYearId });
    }

    async getSemesters(academicYearId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]): Promise<PaginatedResource<Semester>> {
        const semesters = await this.semestersRepository.findSemesters(academicYearId, pagination, sorts, filters);
        const semesterCount = await this.semestersRepository.countSemesters({ academicYearId });
        return {
            totalItems: semesterCount,
            items: semesters,
            page: pagination.page,
            size: pagination.size
        };
    }

    getSemestersWithFilterQuery(filterQuery: Prisma.SemesterWhereInput): Promise<Semester[]> {
        return this.semestersRepository.findSemestersWithFilterQuery(filterQuery);
    }
 
    async createSemester(academicYear: AcademicYear, createSemesterDto: CreateSemesterDto): Promise<Semester> {
        const countSemesters = await this.semestersRepository.countSemesters({ academicYearId: academicYear.id });
        if (countSemesters > academicYear.numberOfSemesters) {
            throw new RpcException({ message: `Academic year id ${academicYear.id} already has ${academicYear.numberOfSemesters} semesters`, statusCode: HttpStatus.BAD_REQUEST });
        }
        return this.semestersRepository.createSemester(academicYear.id, createSemesterDto, countSemesters + 1);
    }

    updateSemester(semesterId: string, updateSemesterDto: UpdateSemesterDto): Promise<Semester> {
        return this.semestersRepository.updateSemester(semesterId, updateSemesterDto);
    }

    async deleteSemester(academicYearId: string, semester: Semester): Promise<Semester> {
        const countSemesters = await this.semestersRepository.countSemesters({ academicYearId });
        if (countSemesters !== semester.semesterNumber) {
            throw new RpcException({ message: `The last semester of academic year id ${academicYearId} need to be delete first and need to delete from end to beginning`, statusCode: HttpStatus.BAD_REQUEST });
        }
        return this.semestersRepository.deleteSemester(semester.id);
    }
}