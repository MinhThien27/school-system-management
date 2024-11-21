import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { CreateClassStudentDto } from "../dtos/create-class-student.dto";
import { UpdateClassStudentDto } from "../dtos/update-class-student.dto";
import { ClassStudentsRepository } from "../repositories/class-students.repository";

type CheckDuplicateClassStudentDto = CreateClassStudentDto | UpdateClassStudentDto;
type CheckDuplicateClassStudentPayload = { classId: string, classStudentId?: string, dto: CheckDuplicateClassStudentDto };

@Injectable()
export class CheckDuplicateClassStudentPipe implements PipeTransform<CheckDuplicateClassStudentPayload, Promise<CheckDuplicateClassStudentPayload>> {

    constructor(
        private readonly classStudentsRepository: ClassStudentsRepository
    ) {}

    async transform(payload: CheckDuplicateClassStudentPayload): Promise<CheckDuplicateClassStudentPayload> {
        const { classId, classStudentId, dto } = payload;
        await this.checkDuplicateStudentInClass(classId, classStudentId, dto);
        return payload;
    }

    private async checkDuplicateStudentInClass(classId: string, classStudentId: string, dto: CheckDuplicateClassStudentDto): Promise<void> {
        let studentId = dto.studentId;
        if (classStudentId) {
            const classStudent = await this.classStudentsRepository.findUniqueClassStudent({ id: classStudentId });
            if (!classStudent) {
                throw new RpcException({ message: `Class student id ${classStudentId} not found`, statusCode: HttpStatus.NOT_FOUND });
            }
            studentId = (studentId && studentId !== classStudent.studentId) ? studentId : undefined;
        }
        if (!studentId) return;
        const duplicate = await this.classStudentsRepository.findUniqueClassStudent({
            classId_studentId: {
                classId, 
                studentId
            }
        });
        if (duplicate) {
            throw new RpcException({ message: `Student id ${studentId} already exist in class id ${classId}`, statusCode: HttpStatus.CONFLICT });
        }
    }
}