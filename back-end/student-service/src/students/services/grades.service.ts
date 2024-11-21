import { Injectable } from "@nestjs/common";
import { GradesRepository } from "../repositories/grades.repository";
import { CreateGradeDto } from "../dtos/create-grade.dto";
import { Prisma } from "@prisma/client";
import { UpdateGradeDto } from "../dtos/update-grade.dto";
import { Grade, GradeWithDetail } from "../types/grade-custom.type";
import { Filtering, PaginatedResource, Pagination, Sorting } from "src/interfaces";
import { GradesFacade } from "../facades/grades.facade";

@Injectable()
export class GradesService {

    constructor(
        private readonly gradesRepository: GradesRepository,
        private readonly gradesFacade: GradesFacade
    ) { }

    async getGrades(
        studentId: string,
        pagination: Pagination,
        sorts?: Sorting[],
        filters?: Filtering[]
    ): Promise<PaginatedResource<GradeWithDetail>> {
        const grades = await this.gradesRepository.findGrades(studentId, pagination, sorts, filters);
        const gradesWithDetail = await this.gradesFacade.getGradesWithDetail(grades);
        const gradeCount = await this.gradesRepository.countGrades({ studentId });
        return {
            totalItems: gradeCount,
            items: gradesWithDetail,
            page: pagination.page,
            size: pagination.size
        };
    }

    getGradesWithFilterQuery(
        filterQuery: Prisma.GradeWhereInput
    ): Promise<Grade[]> {
        return this.gradesRepository.findGradesWithFilterQuery(filterQuery);
    }

    async createGrades(createGradeDto: CreateGradeDto): Promise<Prisma.BatchPayload> {
        const { createGradeForClassSubjectDto, createGradeForClassStudentDto } = createGradeDto;
        if (createGradeForClassSubjectDto) {
            const { studentIds, classSubjectId } = createGradeForClassSubjectDto;
            return await this.gradesRepository.createGradeForStudents(studentIds, classSubjectId);
        }
        const { classSubjectIds, studentId } = createGradeForClassStudentDto;
        return await this.gradesRepository.createGradesForStudent(classSubjectIds, studentId);
    }

    async updateGrade(gradeId: string, updateGradeDto: UpdateGradeDto): Promise<GradeWithDetail> {
        return this.gradesFacade.getGradeWithDetail(
            await this.gradesRepository.updateGrade(gradeId, updateGradeDto)
        );
    }

    async updateGradeWithFilterQuery(filterQuery: Prisma.GradeWhereUniqueInput, updateGradeDto: UpdateGradeDto): Promise<Grade> {
        const updatedGrade = await this.gradesRepository.updateGradeWithFilterQuery(filterQuery, updateGradeDto);
        const { oralTest, smallTest, bigTest, midtermExam, finalExam } = updatedGrade;
        if (
            this.isNotNullAndUndefinded(oralTest) && 
            this.isNotNullAndUndefinded(smallTest) && 
            this.isNotNullAndUndefinded(bigTest) &&
            this.isNotNullAndUndefinded(midtermExam) && 
            this.isNotNullAndUndefinded(finalExam)
        ) {
            const subjectAverage = (oralTest + smallTest + bigTest + midtermExam * 2 + finalExam * 3) / 8;
            return await this.gradesRepository.updateGradeWithFilterQuery(filterQuery, { subjectAverage, ...updateGradeDto });
        };
        return updatedGrade;
    }

    deleteGrades(filterQuery: Prisma.GradeWhereInput): Promise<Prisma.BatchPayload> {
        return this.gradesRepository.deleteGrades(filterQuery);
    }

    async getGrade(grade: Grade): Promise<GradeWithDetail> {
        return this.gradesFacade.getGradeWithDetail(grade);
    }

    private isNotNullAndUndefinded(value: any): boolean {
        if (value == null || value == undefined) {
            return false;
        }
        return true;
    }
}