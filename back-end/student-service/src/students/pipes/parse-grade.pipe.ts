import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { GradesRepository } from "../repositories/grades.repository";
import { Grade } from "../types/grade-custom.type";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class ParseGradePipe implements PipeTransform<string, Promise<Grade>> {

    constructor(private readonly gradesRepository: GradesRepository) {}

    async transform(gradeId: string): Promise<Grade> {
        const grade = await this.gradesRepository.findUniqueGrade({ id: gradeId });
        if (!grade) {
            throw new RpcException({ message: `Grade id ${gradeId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        return grade;
    }
}