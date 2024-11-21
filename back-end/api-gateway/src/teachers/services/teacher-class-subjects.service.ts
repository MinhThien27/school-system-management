import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { throwError, timeout } from "rxjs";
import { CreateTeacherClassSubjectDto } from "../dtos/create-teacher-class-subject.dto";
import { UpdateTeacherClassSubjectDto } from "../dtos/update-teacher-class-subject.dto";
import { Filtering, Pagination, Sorting } from "src/decorators";

@Injectable()
export class TeacherClassSubjectsService {

    constructor(@Inject('TEACHER_SERVICE') private readonly teacherServiceClient: ClientProxy) {}

    getTeacherClassSubjects(teacherId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]) {
        return this.teacherServiceClient.send({ cmd: 'get-teacher-class-subjects' }, { teacherId, pagination, sorts, filters })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    createTeacherClassSubject(teacherId: string, createTeacherClassSubjectDto: CreateTeacherClassSubjectDto) {
        return this.teacherServiceClient.send({ cmd: 'create-teacher-class-subject' }, { teacherId, dto: createTeacherClassSubjectDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
    
    updateTeacherClassSubject(teacherId: string, teacherClassSubjectId: string, updateTeacherClassSubjectDto: UpdateTeacherClassSubjectDto) {
        return this.teacherServiceClient.send({ cmd: 'update-teacher-class-subject' }, { teacherId, teacherClassSubjectId, dto: updateTeacherClassSubjectDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    deleteTeacherClassSubject(teacherId: string, teacherClassSubjectId: string) {
        return this.teacherServiceClient.send({ cmd: 'delete-teacher-class-subject' }, { teacherId, teacherClassSubjectId })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    getTeacherClassSubject(teacherId: string, teacherClassSubjectId: string) {
        return this.teacherServiceClient.send({ cmd: 'get-teacher-class-subject' }, { teacherId, teacherClassSubjectId })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}