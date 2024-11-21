import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { CreateAcademicYearDto } from "../dtos/craete-academic-year.dto";
import { UpdateAcademicYearDto } from "../dtos/update-academic-year.dto";
import { AcademicYearsRepository } from "../repositories/academic-year.repository";
import { AcademicYear } from "../types/academic-year-custom.type";

type CheckDuplicateAcademicYearDto = CreateAcademicYearDto | UpdateAcademicYearDto;
type CheckDuplicateAcademicYearPayload = { academicYearId: string, dto: CheckDuplicateAcademicYearDto };

@Injectable()
export class CheckDuplicateAcademicYearPipe implements PipeTransform<CheckDuplicateAcademicYearPayload, Promise<CheckDuplicateAcademicYearPayload>> {

    constructor(
        private readonly academicYearsRepository: AcademicYearsRepository
    ) { }

    async transform(payload: CheckDuplicateAcademicYearPayload): Promise<CheckDuplicateAcademicYearPayload> {
        const { academicYearId, dto } = payload;
        let academicYear: AcademicYear;
        if (academicYearId) {
            academicYear = await this.academicYearsRepository.findUniqueAcademicYear({ id: academicYearId });
            if (!academicYear) {
                throw new RpcException({ message: `Academic year id ${academicYearId} not found`, statusCode: HttpStatus.NOT_FOUND });
            }
        }
        await this.checkDuplicateNameInAcademicYear(academicYear, dto);
        await this.checkDuplicateStartAndEndDateInAcademicYear(academicYear, dto);
        return payload;
    }

    private async checkDuplicateStartAndEndDateInAcademicYear(academicYear: AcademicYear, dto: CheckDuplicateAcademicYearDto): Promise<void> {
        let startDate = dto.startDate ? new Date(dto.startDate) : undefined;
        let endDate = dto.endDate ? new Date(dto.endDate) : undefined;
        if (academicYear) {
            startDate = (startDate && startDate.getTime() !== academicYear.startDate.getTime()) ? startDate : undefined;
            endDate = (endDate && endDate.getTime() !== academicYear.endDate.getTime()) ? endDate : undefined;
            if (startDate && !endDate) endDate = academicYear.endDate;
            if (!startDate && endDate) startDate = academicYear.startDate;
        }
        if (!startDate && !endDate) return;
        const duplicate = await this.academicYearsRepository.findUniqueAcademicYear({
            startDate_endDate: {
                startDate,
                endDate
            }
        });
        if (duplicate) {
            throw new RpcException({ message: `Start date ${startDate.toISOString()} and End date ${endDate.toISOString()} already exist`, statusCode: HttpStatus.CONFLICT });
        }
    }

    private async checkDuplicateNameInAcademicYear(academicYear: AcademicYear, dto: CheckDuplicateAcademicYearDto): Promise<void> {
        let name = dto.name;
        if (academicYear) {
            name = (name && name !== academicYear.name) ? name : undefined;
        }
        if (!name) return;
        const duplicate = await this.academicYearsRepository.findUniqueAcademicYear({ name });
        if (duplicate) {
            throw new RpcException({ message: `Academic year name ${name} already exist`, statusCode: HttpStatus.CONFLICT });
        }
    }
}