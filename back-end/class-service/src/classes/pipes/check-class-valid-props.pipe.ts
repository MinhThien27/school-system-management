import { HttpStatus, Inject, Injectable, PipeTransform } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { ClassesRepository } from "../repositories/classes.repository";
import { Class } from "../types/class-custom.type";
import { CreateClassDto } from "../dtos/create-class.dto";
import { UpdateClassDto } from "../dtos/update-class.dto";

type CheckClassValidPropsDto = CreateClassDto | UpdateClassDto;
type CheckClassValidPropsPayload = { classId: string, dto: CheckClassValidPropsDto };

@Injectable()
export class CheckClassValidPropsPipe implements PipeTransform<CheckClassValidPropsPayload, Promise<CheckClassValidPropsPayload>> {

    constructor(
        private readonly classesRepository: ClassesRepository,
        @Inject('SEMESTER_SERVICE') private readonly semesterServiceClient: ClientProxy,
        @Inject('CURRICULUM_SERVICE') private readonly curriculumServiceClient: ClientProxy,
        @Inject('CONFIGURATION_SERVICE') private readonly configurationServiceClient: ClientProxy
    ) { }

    async transform(payload: CheckClassValidPropsPayload): Promise<CheckClassValidPropsPayload> {
        const { classId, dto } = payload;
        let _class: Class;
        if (classId) {
            _class = await this.classesRepository.findUniqueClass({ id: classId });
            if (!_class) {
                throw new RpcException({ message: `Class id ${classId} not found`, statusCode: HttpStatus.NOT_FOUND });
            }
        }
        const levelSubjects = await this.checkClassValidLevel(_class, dto);
        payload['levelSubjects'] = levelSubjects;
        const semesters = await this.checkClassValidAcademicYear(_class, dto);
        payload['semesters'] = semesters;
        return payload;
    }

    private async checkClassValidLevel(_class: Class, dto: CheckClassValidPropsDto): Promise<Record<string, any>[]> {
        let levelId = dto.levelId;
        if (_class) {
            levelId = (levelId && levelId !== _class.levelId) ? levelId : undefined;
        }
        if (!levelId) return;
        const levelSubjects: Record<string, any>[] = await firstValueFrom(this.curriculumServiceClient.send(
            { cmd: 'get-level-subjects-with-filter-query' },
            {
                filterQuery: { levelId }
            }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        const schoolConfiguration = await firstValueFrom(this.configurationServiceClient.send(
            { cmd: 'get-school-configuration' },
            {}
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        for (let i = 0; i < schoolConfiguration.numberOfSemesters; i++) {
            let count = 0;
            for (const levelSubject of levelSubjects) {
                if (levelSubject.semesterNumber === i + 1) {
                    count++;
                }
            }
            if (count === 0) {
                throw new RpcException({ message: `Level id ${levelId} cannot use for creating class`, statusCode: HttpStatus.BAD_REQUEST });
            }
        }
        return levelSubjects;
    }

    private async checkClassValidAcademicYear(_class: Class, dto: CheckClassValidPropsDto): Promise<Record<string, any>[]> {
        let academicYearId = dto.academicYearId;
        if (_class) {
            academicYearId = (academicYearId && academicYearId !== _class.academicYearId) ? academicYearId : undefined;
        }
        if (!academicYearId) return;
        const academicYear: Record<string, any> = await firstValueFrom(this.semesterServiceClient.send(
            { cmd: 'get-academic-year' },
            academicYearId
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        const semesters: Record<string, any>[] = await firstValueFrom(this.semesterServiceClient.send(
            { cmd: 'get-semesters-with-filter-query' },
            { filterQuery: { academicYearId } }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        if (semesters.length < academicYear.numberOfSemesters) {
            throw new RpcException({ message: `Academic year id ${academicYearId} cannot use for creating class`, statusCode: HttpStatus.BAD_REQUEST });
        }
        return semesters;
    }
}