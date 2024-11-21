import { Inject, Injectable, PipeTransform } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { CreateClassStudentDto } from "../dtos/create-class-student.dto";
import { UpdateClassStudentDto } from "../dtos/update-class-student.dto";

type CheckClassStudentPropsExistenceDto = CreateClassStudentDto | UpdateClassStudentDto;
type CheckClassStudentPropsExistencePayload = { classId: string, dto: CheckClassStudentPropsExistenceDto };

@Injectable()
export class CheckClassStudentPropsExistencePipe implements PipeTransform<CheckClassStudentPropsExistencePayload, Promise<CheckClassStudentPropsExistencePayload>> {

    constructor(
        @Inject('STUDENT_SERVICE') private readonly studentServiceClient: ClientProxy
    ) {}

    async transform(payload: CheckClassStudentPropsExistencePayload): Promise<CheckClassStudentPropsExistencePayload> {
        const { dto } = payload;
        await this.checkStudentExistence(dto);
        return payload;
    }

    private async checkStudentExistence(dto: CheckClassStudentPropsExistenceDto): Promise<void> {
        const { studentId } = dto;
        if (!studentId) return;
        await(firstValueFrom(this.studentServiceClient.send(
            { cmd: 'get-student' }, 
            studentId
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        }))));
    }
}