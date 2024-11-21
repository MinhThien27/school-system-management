import { HttpStatus, Inject, Injectable, PipeTransform } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { CreateTeacherClassSubjectDto } from "../dtos/create-teacher-class-subject.dto";
import { UpdateTeacherClassSubjectDto } from "../dtos/update-teacher-class-subject.dto";
import { DepartmentTeachersRepository } from "src/departments/repositories/department-teachers.repository";
import { DepartmentSubjectsRepository } from "src/departments/repositories/department-subjects.repository";

type CheckTeacherClassSubjectPropsExistenceDto = CreateTeacherClassSubjectDto | UpdateTeacherClassSubjectDto;
type CheckTeacherClassSubjectPropsExistencePayload = { teacherId: string, dto: CheckTeacherClassSubjectPropsExistenceDto };

@Injectable()
export class CheckTeacherClassSubjectPropsExistencePipe implements PipeTransform<CheckTeacherClassSubjectPropsExistencePayload, Promise<CheckTeacherClassSubjectPropsExistencePayload>> {

    constructor(
        private readonly departmentTeachersRepository: DepartmentTeachersRepository,
        private readonly departmentSubjectsRepository: DepartmentSubjectsRepository,
        @Inject('CLASS_SERVICE') private readonly classServiceClient: ClientProxy
    ) {}

    async transform(payload: CheckTeacherClassSubjectPropsExistencePayload): Promise<CheckTeacherClassSubjectPropsExistencePayload> {
        const { teacherId, dto } = payload;
        const classSubject = await this.checkClassSubjectExistence(dto);
        await this.checkClassSubjectExistInDepartment(classSubject, teacherId);
        return payload;
    }

    private async checkClassSubjectExistence(dto: CheckTeacherClassSubjectPropsExistenceDto): Promise<Record<string, any>> {
        const { classSubjectId } = dto;
        if (!classSubjectId) return;
        const classSubject = await(firstValueFrom(this.classServiceClient.send(
            { cmd: 'get-class-subject-without-class-id' }, 
            classSubjectId
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        }))));
        return classSubject;
    }

    private async checkClassSubjectExistInDepartment(classSubject: Record<string, any>, teacherId: string): Promise<void> {
        const departmentTeacher = await this.departmentTeachersRepository.findDepartmentTeacher({ teacherId });
        if (!departmentTeacher) {
            throw new RpcException({ message: `Teacher id ${teacherId} not in any department`, statusCode: HttpStatus.NOT_FOUND });
        }
        if (!departmentTeacher.availableSubjects.map(availableSubject => availableSubject.subjectId).includes(classSubject.subjectId)) {
            throw new RpcException({ message: `Subject id ${classSubject.subjectId} not available for teacher id ${teacherId}`, statusCode: HttpStatus.BAD_REQUEST });
        }
    }
}