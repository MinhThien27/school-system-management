import { HttpStatus, Inject, Injectable, PipeTransform } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { CreateStudentDto } from "../dtos/create-student.dto";
import { UpdateStudentDto } from "../dtos/update-student.dto";
import { Student, User } from "../types/student-custom.type";
import { firstValueFrom } from "rxjs";
import { StudentsRepository } from "../repositories/students.repository";

type CheckDuplicateStudentDto = CreateStudentDto | UpdateStudentDto;
type CheckDuplicateStudentPayload = { studentId: string, dto: CheckDuplicateStudentDto };

@Injectable()
export class CheckDuplicateStudentPipe implements PipeTransform<CheckDuplicateStudentPayload, Promise<CheckDuplicateStudentPayload>> {

    constructor(
        private readonly studentsRepository: StudentsRepository,
        @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy
    ) { }

    async transform(payload: CheckDuplicateStudentPayload): Promise<CheckDuplicateStudentPayload> {
        const { studentId, dto } = payload;
        let student: Student;
        if (studentId) {
            student = await this.studentsRepository.findUniqueStudent({ id: studentId });
            if (!student) {
                throw new RpcException({ message: `Student id ${studentId} not found`, statusCode: HttpStatus.NOT_FOUND});
            }
        }
        await this.checkDuplicateCitizenIdentification(studentId, dto);
        await this.checkDuplicatePhoneNumber(studentId, dto);
        return payload;
    }

    private async checkDuplicateCitizenIdentification(studentId: string, dto: CheckDuplicateStudentDto): Promise<void> {
        const { citizenIdentification } = dto;
        if (!citizenIdentification) return;
        const user: User = await firstValueFrom(this.authServiceClient.send(
            { cmd: 'get-user-account-with-filter-query' },
            { filterQuery: { citizenIdentification } }
        ));
        if (!studentId && user) {
            throw new RpcException({ message: `Citizen identification ${citizenIdentification} already exist`, statusCode: HttpStatus.CONFLICT });
        } 
        if (studentId && user && user._id !== studentId) {
            throw new RpcException({ message: `Citizen identification ${citizenIdentification} already exist`, statusCode: HttpStatus.CONFLICT });
        }
    }

    private async checkDuplicatePhoneNumber(studentId: string, dto: CheckDuplicateStudentDto): Promise<void> {
        const { phoneNumber } = dto;
        if (!phoneNumber) return;
        const user: User = await firstValueFrom(this.authServiceClient.send(
            { cmd: 'get-user-account-with-filter-query' },
            { filterQuery: { phoneNumber } }
        ));
        if (!studentId && user) {
            throw new RpcException({ message: `Phone number ${phoneNumber} already exist`, statusCode: HttpStatus.CONFLICT });
        } 
        if (studentId && user && user._id !== studentId) {
            throw new RpcException({ message: `Phone number ${phoneNumber} already exist`, statusCode: HttpStatus.CONFLICT });
        }
    }
}