import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { CreateSemesterDto } from "../dtos/create-semester.dto";
import { UpdateSemesterDto } from "../dtos/update-semester.dto";
import { SemestersRepository } from "../repositories/semesters.repository";
import { AcademicYearsRepository } from "src/academic-years/repositories/academic-year.repository";
import { Semester } from "../types/semester-custom.type";
import { AcademicYear } from "src/academic-years/types/academic-year-custom.type";

type CheckSemesterValidPropsDto = CreateSemesterDto | UpdateSemesterDto;
type CheckSemesterValidPropsPayload = { academicYearId: string, semesterId: string, dto: CheckSemesterValidPropsDto };

@Injectable()
export class CheckSemesterValidPropsPipe implements PipeTransform<CheckSemesterValidPropsPayload, Promise<CheckSemesterValidPropsPayload>> {

    constructor(
        private readonly academicYearsRepository: AcademicYearsRepository,
        private readonly semestersRepository: SemestersRepository
    ) { }

    async transform(payload: CheckSemesterValidPropsPayload): Promise<CheckSemesterValidPropsPayload> {
        const { academicYearId, semesterId, dto } = payload;
        const academicYear = await this.academicYearsRepository.findUniqueAcademicYear({ id: academicYearId });
        if (!academicYear) {
            throw new RpcException({ message: `Academic year id ${academicYearId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        let semester: Semester;
        if (semesterId) {
            semester = await this.semestersRepository.findUniqueSemester({ id: semesterId });
            if (!semester) {
                throw new RpcException({ message: `Semester id ${semesterId} not found`, statusCode: HttpStatus.NOT_FOUND });
            }
        }
        await this.checkSemesterValidDates(academicYear, semester, dto);
        return payload;
    }

    private async checkSemesterValidDates(academicYear: AcademicYear, semester: Semester, dto: CheckSemesterValidPropsDto): Promise<void> {
        let startDate = dto.startDate ? new Date(dto.startDate) : undefined;
        let endDate = dto.endDate ? new Date(dto.endDate) : undefined;
        if (semester) {
            startDate = (startDate && startDate.getTime() !== semester.startDate.getTime()) ? startDate : undefined;
            endDate = (endDate && endDate.getTime() !== semester.endDate.getTime()) ? endDate : undefined;
            if (startDate && !endDate) endDate = semester.endDate;
            if (!startDate && endDate) startDate = semester.startDate;
        }
        if (!startDate && !endDate) return;
        if (startDate < academicYear.startDate) {
            throw new RpcException({ message: 'Start date must start after or equal to academic year start date', statusCode: HttpStatus.BAD_REQUEST });
        }
        if (endDate > academicYear.endDate) {
            throw new RpcException({ message: 'End date must start before or equal to academic year end date', statusCode: HttpStatus.BAD_REQUEST });
        }
        const semesters = await this.semestersRepository.findSemestersWithFilterQuery({ academicYearId: academicYear.id }, { semesterNumber: 'asc' });
        if (!semesters.length) return;
        if (!semester) {
            if (semesters[semesters.length - 1].endDate > startDate) {
                throw new RpcException({ message: `Invalid semester dates for academic year id ${academicYear.id}`, statusCode: HttpStatus.BAD_REQUEST });
            }
        } else {
            if ((semester.semesterNumber > 1 && startDate < semesters[semester.semesterNumber - 2].endDate) || (semester.semesterNumber !== semesters.length && endDate > semesters[semester.semesterNumber].startDate)) {
                throw new RpcException({ message: `Invalid semester dates for academic year id ${academicYear.id}`, statusCode: HttpStatus.BAD_REQUEST });
            }
        }
    }
}