import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { StudentDetailRepository } from "../repositories/student-detail.repository";
import { RpcException } from "@nestjs/microservices";
import { CreateStudentDetailDto } from "../dtos/create-student-detail.dto";
import { UpdateStudentDetailDto } from "../dtos/update-student-detail.dto";
import { StudentsRepository } from "../repositories/students.repository";

type CheckDuplicateStudenDetailtDto = CreateStudentDetailDto | UpdateStudentDetailDto;
type CheckDuplicateStudentDetailPayload = { studentId: string, studentDetailId?: string, dto: CheckDuplicateStudenDetailtDto };

@Injectable()
export class CheckDuplicateStudenDetailPipe implements PipeTransform<CheckDuplicateStudentDetailPayload, Promise<CheckDuplicateStudentDetailPayload>> {

    constructor(
        private readonly studentsRepository: StudentsRepository,
        private readonly studentDetailRepository: StudentDetailRepository
    ) { }

    async transform(payload: CheckDuplicateStudentDetailPayload): Promise<CheckDuplicateStudentDetailPayload> {
        const { studentId, studentDetailId } = payload;
        const student = await this.studentsRepository.findUniqueStudent({ id: studentId });
        if (!student) {
            throw new RpcException({ message: `Student id ${studentId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        if (studentDetailId) return payload;
        const duplicateStudentDetail = await this.studentDetailRepository.findUniqueStudentDetail({ studentId });
        if (duplicateStudentDetail) {
            throw new RpcException({
                message: `Student detail already exist for student id ${studentId}`,
                statusCode: HttpStatus.CONFLICT
            });
        }
        return payload;
    }
}