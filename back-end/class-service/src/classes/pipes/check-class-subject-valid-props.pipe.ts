import { HttpStatus, Inject, Injectable, PipeTransform } from "@nestjs/common";
import { CreateclassSubjectDto } from "../dtos/create-class-subject.dto";
import { UpdateClassSubjectDto } from "../dtos/update-class-subject.dto";
import { ClassSubjectsRepository } from "../repositories/class-subjects.repository";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { ClassSubject } from "../types/class-subject-custom.type";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { Class } from "../types/class-custom.type";
import { ClassesRepository } from "../repositories/classes.repository";

type CheckClassSubjectValidPropsDto = CreateclassSubjectDto | UpdateClassSubjectDto;
type CheckClassSubjectValidPropsPayload = { classId: string, classSubjectId?: string, dto: CheckClassSubjectValidPropsDto };

@Injectable()
export class CheckClassSubjectValidPropsPipe implements PipeTransform<CheckClassSubjectValidPropsPayload, Promise<CheckClassSubjectValidPropsPayload>> {

    constructor(
        private readonly classesRepository: ClassesRepository,
        private readonly classSubjectsRespository: ClassSubjectsRepository,
        @Inject('SEMESTER_SERVICE') private readonly semesterServiceClient: ClientProxy
    ) { }

    async transform(payload: CheckClassSubjectValidPropsPayload): Promise<CheckClassSubjectValidPropsPayload> {
        const { classId, classSubjectId, dto } = payload;
        const _class = await this.classesRepository.findUniqueClass({ id: classId });
        if (!_class) {
            throw new RpcException({ message: `Class id ${classId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        let classSubject: ClassSubject;
        if (classSubjectId) {
            classSubject = await this.classSubjectsRespository.findUniqueClassSubject({ id: classSubjectId });
            if (!classSubject) {
                throw new RpcException({ message: `Class subject id ${classSubjectId} not found`, statusCode: HttpStatus.NOT_FOUND });
            }
        }
        await this.checkClassSubjectValidSemester(_class, classSubject, dto);
        await this.checkClassSubjectValidDates(classSubject, dto);
        return payload;
    }

    private async checkClassSubjectValidSemester(_class: Class, classSubject: ClassSubject, dto: CheckClassSubjectValidPropsDto): Promise<void> {
        let semesterId = dto.semesterId;
        if (classSubject) {
            semesterId = (semesterId && semesterId !== classSubject.semesterId) ? semesterId : undefined;
        }
        if (!semesterId) return;
        const semester = await firstValueFrom(this.semesterServiceClient.send(
            { cmd: 'get-semester-without-academic-year-id' },
            semesterId
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        if (semester?.academicYearId !== _class.academicYearId) {
            throw new RpcException({ message: `Invalid semester id ${semesterId}`, statusCode: HttpStatus.BAD_REQUEST });
        }
    }

    private async checkClassSubjectValidDates(classSubject: ClassSubject, dto: CheckClassSubjectValidPropsDto): Promise<void> {
        let startDate = dto.startDate ? new Date(dto.startDate) : undefined;
        let endDate = dto.endDate ? new Date(dto.endDate) : undefined;
        let semesterId = dto.semesterId;
        if (classSubject) {
            const asignResult = this.asignValuesForCheckClassSubjectValidDates(startDate, endDate, semesterId, classSubject);
            startDate = asignResult.startDate;
            endDate = asignResult.endDate;
            semesterId = asignResult.semesterId;
        }
        if (!startDate && !endDate && !semesterId) return;
        if (semesterId) {
            const semester = await firstValueFrom(this.semesterServiceClient.send(
                { cmd: 'get-semester-without-academic-year-id' },
                semesterId
            ).pipe(timeout({
                first: 10000,
                with: () => throwError(() => new RequestTimeoutRpcException())
            })));
            if (!this.isValidDates(startDate, endDate, new Date(semester.startDate), new Date(semester.endDate))) {
                throw new RpcException({ message: `Invalid start date or end date. Date not in the semester id ${semesterId}`, statusCode: HttpStatus.BAD_REQUEST });
            }
        }
    }

    private asignValuesForCheckClassSubjectValidDates(startDate: Date, endDate: Date, semesterId: string, classSubject: ClassSubject) {
        startDate = (startDate && startDate.getTime() !== classSubject.startDate.getTime()) ? startDate : undefined;
        endDate = (endDate && endDate.getTime() !== classSubject.endDate.getTime()) ? endDate : undefined;
        semesterId = (semesterId && semesterId !== classSubject.semesterId) ? semesterId : undefined;
        if (!startDate) {
            startDate = classSubject.startDate;
            if (!endDate && semesterId) endDate = classSubject.endDate;
            else if (endDate && !semesterId) semesterId = classSubject.semesterId;
            else if (endDate && semesterId) startDate = classSubject.startDate;
            else startDate = undefined;
        } else if (!endDate) {
            endDate = classSubject.endDate;
            if (!startDate && semesterId) startDate = classSubject.startDate;
            else if (startDate && !semesterId) semesterId = classSubject.semesterId;
            else if (startDate && semesterId) endDate = classSubject.endDate;
            else endDate = undefined;
        } else if (!semesterId) {
            semesterId = classSubject.semesterId;
            if (!startDate && endDate) startDate = classSubject.startDate;
            else if (startDate && !endDate) endDate = classSubject.endDate;
            else if (startDate && endDate) semesterId = classSubject.semesterId;
            else semesterId = undefined;
        }
        return { startDate, endDate, semesterId };
    }

    private isValidDates(startDate: Date, endDate: Date, semesterStartDate: Date, semesterEndDate: Date): boolean {
        if (startDate < semesterStartDate || startDate > semesterEndDate) return false;
        if (endDate < semesterStartDate || endDate > semesterEndDate) return false;
        return true;
    }
}