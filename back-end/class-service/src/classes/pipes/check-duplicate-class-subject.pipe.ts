import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { ClassSubjectsRepository } from "../repositories/class-subjects.repository";
import { CreateclassSubjectDto } from "../dtos/create-class-subject.dto";
import { UpdateClassSubjectDto } from "../dtos/update-class-subject.dto";
import { RpcException } from "@nestjs/microservices";
import { ClassSubject } from "../types/class-subject-custom.type";
import { ClassesRepository } from "../repositories/classes.repository";

type CheckDuplicateClassSubjectDto = CreateclassSubjectDto | UpdateClassSubjectDto;
type CheckDuplicateClassSubjectPayload = { classId: string, classSubjectId?: string, dto: CheckDuplicateClassSubjectDto };

@Injectable()
export class CheckDuplicateClassSubjectPipe implements PipeTransform<CheckDuplicateClassSubjectPayload, Promise<CheckDuplicateClassSubjectPayload>> {

    constructor(
        private readonly classesRepository: ClassesRepository,
        private readonly classSubjectsRepository: ClassSubjectsRepository
    ) {}

    async transform(payload: CheckDuplicateClassSubjectPayload): Promise<CheckDuplicateClassSubjectPayload> {
        const { classId, classSubjectId, dto } = payload;
        const _class = await this.classesRepository.findClass({ id: classId });
        if (!_class) {
            throw new RpcException({ message: `Class id ${classId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        let classSubject: ClassSubject;
        if (classSubjectId) {
            classSubject = await this.classSubjectsRepository.findUniqueClassSubject({ id: classSubjectId });
            if (!classSubject) {
                throw new RpcException({ message: `Class subject id ${classSubjectId} not found`, statusCode: HttpStatus.NOT_FOUND });
            }
        }
        await this.checkDuplicateSubjectInClassForSemester(classId, classSubject, dto);
        return payload;
    }

    private async checkDuplicateSubjectInClassForSemester(classId: string, classSubject: ClassSubject, dto: CheckDuplicateClassSubjectDto): Promise<void> {
        let semesterId = dto.semesterId;
        let subjectId = dto.subjectId;
        if (classSubject) {
            semesterId = (semesterId && semesterId !== classSubject.semesterId) ? semesterId : undefined;
            subjectId = (subjectId && subjectId !== classSubject.subjectId) ? subjectId : undefined;
            if (semesterId && !subjectId) subjectId = classSubject.subjectId;
            if (!semesterId && subjectId) semesterId = classSubject.semesterId;
        }
        if (!semesterId && !subjectId) return;
        const duplicate = await this.classSubjectsRepository.findUniqueClassSubject({
            semesterId_classId_subjectId: {
                semesterId,
                classId,
                subjectId
            }
        });
        if (duplicate) {
            throw new RpcException({ message: `Subject id ${subjectId} already exist in semester id ${semesterId} of class id ${classId}`, statusCode: HttpStatus.CONFLICT });
        }
    }
}