import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { AcademicYearsRepository } from "../repositories/academic-year.repository";
import { AcademicYear } from "../types/academic-year-custom.type";

@Injectable()
export class ParseAcademicYearPipe implements PipeTransform<string, Promise<AcademicYear>> {

    constructor(private readonly academicYearsRepository: AcademicYearsRepository) {}

    async transform(academicYearId: string): Promise<AcademicYear> {
        const academicYear = await this.academicYearsRepository.findUniqueAcademicYear({ id: academicYearId });
        if (!academicYear) {
            throw new RpcException({ message: `Academic year id ${academicYearId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        return academicYear;
    }
}