import { Inject, Injectable, PipeTransform } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { CreateClassDto } from "../dtos/create-class.dto";
import { UpdateClassDto } from "../dtos/update-class.dto";

type CheckClassPropsExistenceDto = CreateClassDto | UpdateClassDto;
type CheckClassPropsExistencePayload = { classId: string, dto: CheckClassPropsExistenceDto };

@Injectable()
export class CheckClassPropsExistencePipe implements PipeTransform<CheckClassPropsExistencePayload, Promise<CheckClassPropsExistencePayload>> {

    constructor(
        @Inject('TEACHER_SERVICE') private readonly teacherServiceClient: ClientProxy,
        @Inject('SEMESTER_SERVICE') private readonly semesterServiceClient: ClientProxy,
        @Inject('CURRICULUM_SERVICE') private readonly curriculumServiceClient: ClientProxy,
    ) {}

    async transform(payload: CheckClassPropsExistencePayload): Promise<CheckClassPropsExistencePayload> {
        const { dto } = payload;
        await this.checkFormTeacherExistence(dto);
        await this.checkAcademicYearExistence(dto);
        await this.checkLevelExistence(dto);
        return payload;
    }

    private async checkFormTeacherExistence(dto: CheckClassPropsExistenceDto): Promise<void> {
        const { formTeacherId } = dto;
        if (!formTeacherId) return;
        await firstValueFrom(this.teacherServiceClient.send(
            { cmd: 'get-teacher' }, 
            formTeacherId
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        return;
    }

    private async checkAcademicYearExistence(dto: CheckClassPropsExistenceDto): Promise<void> {
        const { academicYearId } = dto;
        if (!academicYearId) return;
        await firstValueFrom(this.semesterServiceClient.send(
            { cmd: 'get-academic-year' }, 
            academicYearId
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        return;
    }

    private async checkLevelExistence(dto: CheckClassPropsExistenceDto): Promise<void> {
        const { levelId } = dto;
        if (!levelId) return;
        await firstValueFrom(this.curriculumServiceClient.send(
            { cmd: 'get-level' }, 
            levelId
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        return;
    }
}