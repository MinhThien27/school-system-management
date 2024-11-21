import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { CreateSemesterDto } from "../dtos/create-semester.dto";
import { UpdateSemesterDto } from "../dtos/update-semester.dto";
import { SemestersRepository } from "../repositories/semesters.repository";
import { Semester } from "../types/semester-custom.type";
import { AcademicYearsRepository } from "src/academic-years/repositories/academic-year.repository";

type CheckDuplicateSemesterDto = CreateSemesterDto | UpdateSemesterDto;
type CheckDuplicateSemesterPayload = { academicYearId: string, semesterId: string, dto: CheckDuplicateSemesterDto };

@Injectable()
export class CheckDuplicateSemesterPipe implements PipeTransform<CheckDuplicateSemesterPayload, Promise<CheckDuplicateSemesterPayload>> {

    constructor(
        private readonly academicYearsRepository: AcademicYearsRepository,
        private readonly semestersRepository: SemestersRepository
    ) { }

    async transform(payload: CheckDuplicateSemesterPayload): Promise<CheckDuplicateSemesterPayload> {
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
        // await this.checkDuplicateNameInSemester(semester, dto);
        await this.checkDuplicateStartAndEndDateInSemester(academicYearId, semester, dto);
        return payload;
    }

    private async checkDuplicateStartAndEndDateInSemester(academicYearId: string, semester: Semester, dto: CheckDuplicateSemesterDto): Promise<void> {
        let startDate = dto.startDate ? new Date(dto.startDate) : undefined;
        let endDate = dto.endDate ? new Date(dto.endDate) : undefined;
        if (semester) {
            startDate = (startDate && startDate.getTime() !== semester.startDate.getTime()) ? startDate : undefined;
            endDate = (endDate && endDate.getTime() !== semester.endDate.getTime()) ? endDate : undefined;
            if (startDate && !endDate) endDate = semester.endDate;
            if (!startDate && endDate) startDate = semester.startDate;
        }
        if (!startDate && !endDate) return;
        const duplicate = await this.semestersRepository.findUniqueSemester({
            startDate_endDate_academicYearId: {
                startDate,
                endDate,
                academicYearId
            }
        });
        if (duplicate) {
            throw new RpcException({ message: `Semester start in ${startDate.toISOString()} and end in ${endDate.toISOString()} already exist in academic year id ${academicYearId}`, statusCode: HttpStatus.CONFLICT });
        }
    }

    // private async checkDuplicateNameInSemester(semester: Semester, dto: CheckDuplicateSemesterDto): Promise<void> {
    //     let name = dto.name;
    //     if (semester) {
    //         name = (name && name !== semester.name) ? name : undefined;
    //     }
    //     if (!name) return;
    //     const duplicate = await this.semestersRepository.findUniqueSemester({ name });
    //     if (duplicate) {
    //         throw new RpcException({ message: `Semester name ${name} already exist`, statusCode: HttpStatus.CONFLICT });
    //     }
    // }
}