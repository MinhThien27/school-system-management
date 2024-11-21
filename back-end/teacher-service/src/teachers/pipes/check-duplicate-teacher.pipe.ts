import { HttpStatus, Inject, Injectable, PipeTransform } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { CreateTeacherDto } from "../dtos/create-teacher.dto";
import { UpdateTeacherDto } from "../dtos/update-teacher.dto";
import { TeachersRepository } from "../repositories/teachers.repository";
import { Teacher, User } from "../types/teacher-custom.type";

type CheckDuplicateTeacherDto = CreateTeacherDto | UpdateTeacherDto;
type CheckDuplicateTeacherPayload = { teacherId: string, dto: CheckDuplicateTeacherDto };

@Injectable()
export class CheckDuplicateTeacherPipe implements PipeTransform<CheckDuplicateTeacherPayload, Promise<CheckDuplicateTeacherPayload>> {

    constructor(
        private readonly teachersRepository: TeachersRepository,
        @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy
    ) { }

    async transform(payload: CheckDuplicateTeacherPayload): Promise<CheckDuplicateTeacherPayload> {
        const { teacherId, dto } = payload;
        let teacher: Teacher;
        if (teacherId) {
            teacher = await this.teachersRepository.findUniqueTeacher({ id: teacherId });
            if (!teacher) {
                throw new RpcException({ message: `Teacher id ${teacherId} not found`, statusCode: HttpStatus.NOT_FOUND});
            }
        }
        await this.checkDuplicateCitizenIdentification(teacherId, dto);
        await this.checkDuplicatePhoneNumber(teacherId, dto);
        return payload;
    }

    private async checkDuplicateCitizenIdentification(teacherId: string, dto: CheckDuplicateTeacherDto): Promise<void> {
        const { citizenIdentification } = dto;
        if (!citizenIdentification) return;
        const user: User = await firstValueFrom(this.authServiceClient.send(
            { cmd: 'get-user-account-with-filter-query' },
            { filterQuery: { citizenIdentification } }
        ));
        if (!teacherId && user) {
            throw new RpcException({ message: `Citizen identification ${citizenIdentification} already exist`, statusCode: HttpStatus.CONFLICT });
        } 
        if (teacherId && user && user._id !== teacherId) {
            throw new RpcException({ message: `Citizen identification ${citizenIdentification} already exist`, statusCode: HttpStatus.CONFLICT });
        }
    }

    private async checkDuplicatePhoneNumber(teacherId: string, dto: CheckDuplicateTeacherDto): Promise<void> {
        const { phoneNumber } = dto;
        if (!phoneNumber) return;
        const user: User = await firstValueFrom(this.authServiceClient.send(
            { cmd: 'get-user-account-with-filter-query' },
            { filterQuery: { phoneNumber } }
        ));
        if (!teacherId && user) {
            throw new RpcException({ message: `Phone number ${phoneNumber} already exist`, statusCode: HttpStatus.CONFLICT });
        } 
        if (teacherId && user && user._id !== teacherId) {
            throw new RpcException({ message: `Phone number ${phoneNumber} already exist`, statusCode: HttpStatus.CONFLICT });
        }
    }
}