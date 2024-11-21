import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { SemestersRepository } from "../repositories/semesters.repository";
import { Semester } from "../types/semester-custom.type";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class ParseSemesterPipe implements PipeTransform<string, Promise<Semester>> {

    constructor(private readonly semestersRepository: SemestersRepository) {}

    async transform(semesterId: string): Promise<Semester> {
        const semester = await this.semestersRepository.findUniqueSemester({ id: semesterId });
        if (!semester) {
            throw new RpcException({ message: `Semester id ${semesterId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        return semester;
    }
}