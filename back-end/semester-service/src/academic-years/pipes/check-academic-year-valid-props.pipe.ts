import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { AcademicYearsRepository } from "src/academic-years/repositories/academic-year.repository";
import { AcademicYear } from "src/academic-years/types/academic-year-custom.type";
import { CreateAcademicYearDto } from "../dtos/craete-academic-year.dto";
import { UpdateAcademicYearDto } from "../dtos/update-academic-year.dto";

type CheckAcademicYearValidPropsDto = CreateAcademicYearDto | UpdateAcademicYearDto;
type CheckAcademicYearValidPropsPayload = { academicYearId: string, dto: CheckAcademicYearValidPropsDto };

@Injectable()
export class CheckAcademicYearValidPropsPipe implements PipeTransform<CheckAcademicYearValidPropsPayload, Promise<CheckAcademicYearValidPropsPayload>> {

    constructor(
        private readonly academicYearsRepository: AcademicYearsRepository
    ) { }

    async transform(payload: CheckAcademicYearValidPropsPayload): Promise<CheckAcademicYearValidPropsPayload> {
        const { academicYearId, dto } = payload;
        let academicYear: AcademicYear;
        if (academicYearId) {
            academicYear = await this.academicYearsRepository.findUniqueAcademicYear({ id: academicYearId });
            if (!academicYear) {
                throw new RpcException({ message: `Academic year id ${academicYearId} not found`, statusCode: HttpStatus.NOT_FOUND });
            }
        }
        await this.checkAcademicYearValidDates(academicYear, dto);
        return payload;
    }

    private async checkAcademicYearValidDates(academicYear: AcademicYear, dto: CheckAcademicYearValidPropsDto): Promise<void> {
        let startDate = dto.startDate ? new Date(dto.startDate) : undefined;
        let endDate = dto.endDate ? new Date(dto.endDate) : undefined;
        if (academicYear) {
            startDate = (startDate && startDate.getTime() !== academicYear.startDate.getTime()) ? startDate : undefined;
            endDate = (endDate && endDate.getTime() !== academicYear.endDate.getTime()) ? endDate : undefined;
            if (startDate && !endDate) endDate = academicYear.endDate;
            if (!startDate && endDate) startDate = academicYear.startDate;
        }
        const countAcademicYear = await this.academicYearsRepository.countAcademicYears();
        if (countAcademicYear === 0) return;
        const academicYears = await this.academicYearsRepository.findAcademicYearsWithFilterQuery({}, { startDate: 'asc' });
        if (!academicYears.length) return;
        if (!academicYear) {
            if (startDate < academicYears[academicYears.length - 1].endDate) {
                throw new RpcException({ message: `Invalid dates for academic year`, statusCode: HttpStatus.BAD_REQUEST });
            }
        } else {
            const index = academicYears.map(academicYear => academicYear.id).indexOf(academicYear.id);
            console.log({ index })
            if ((index > 0 && startDate < academicYears[index - 1].endDate) || (index !== academicYears.length - 1 && endDate > academicYears[index + 1].startDate)) {
                throw new RpcException({ message: `Invalid dates for academic year`, statusCode: HttpStatus.BAD_REQUEST });
            }
        }
    }
}