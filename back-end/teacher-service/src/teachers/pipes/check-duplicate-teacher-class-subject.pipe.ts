import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { CreateTeacherClassSubjectDto } from "../dtos/create-teacher-class-subject.dto";
import { UpdateTeacherClassSubjectDto } from "../dtos/update-teacher-class-subject.dto";
import { TeacherClassSubjectsRepository } from "../repositories/teacher-class-subjects.repository";

type CheckDuplicateTeacherClassSubjectDto = CreateTeacherClassSubjectDto | UpdateTeacherClassSubjectDto;
type CheckDuplicateTeacherClassSubjectPayload = { teacherId: string, teacherClassSubjectId?: string, dto: CheckDuplicateTeacherClassSubjectDto };

@Injectable()
export class CheckDuplicateTeacherClassSubjectPipe implements PipeTransform<CheckDuplicateTeacherClassSubjectPayload, Promise<CheckDuplicateTeacherClassSubjectPayload>> {

    constructor(
        private readonly teacherCLassSubjectsRepository: TeacherClassSubjectsRepository
    ) {}

    async transform(payload: CheckDuplicateTeacherClassSubjectPayload): Promise<CheckDuplicateTeacherClassSubjectPayload> {
        const { teacherId, teacherClassSubjectId, dto } = payload;
        await this.checkDuplicateClassSubjectInTeacher(teacherId, teacherClassSubjectId, dto);
        return payload;
    }

    private async checkDuplicateClassSubjectInTeacher(teacherId: string, teacherClassSubjectId: string, dto: CheckDuplicateTeacherClassSubjectDto): Promise<void> {
        let classSubjectId = dto.classSubjectId;
        if (teacherClassSubjectId) {
            const teacherClassSubject = await this.teacherCLassSubjectsRepository.findUniqueTeacherClassSubject({ id: teacherClassSubjectId });
            if (!teacherClassSubject) {
                throw new RpcException({ message: `Teacher class subject id ${teacherClassSubjectId} not found`, statusCode: HttpStatus.NOT_FOUND });
            }
            classSubjectId = (classSubjectId && classSubjectId !== teacherClassSubject.classSubjectId) ? classSubjectId : undefined;
        }
        if (!classSubjectId) return;
        const duplicate = await this.teacherCLassSubjectsRepository.findUniqueTeacherClassSubject({
            teacherId_classSubjectId: {
                teacherId,
                classSubjectId
            }
        });
        if (duplicate) {
            throw new RpcException({ message: `Class subject id ${classSubjectId} already exist in teacher id ${teacherId}`, statusCode: HttpStatus.CONFLICT });
        }
    }
}