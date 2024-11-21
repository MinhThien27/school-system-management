import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateClassSubjectDto } from "../dtos/create-class-subject.dto";
import { throwError, timeout } from "rxjs";
import { UpdateClassSubjectDto } from "../dtos/update-class-subject.dto";
import { Filtering, Pagination, Sorting } from "src/decorators";

@Injectable()
export class ClassSubjectsService {
    
    constructor(@Inject('CLASS_SERVICE') private readonly classServiceClient: ClientProxy) {}

    getClassSubjects(classId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]) {
        return this.classServiceClient.send({ cmd: 'get-class-subjects' }, { classId, pagination, sorts, filters })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    createClassSubject(classId: string, createClassSubjectDto: CreateClassSubjectDto) {
        return this.classServiceClient.send({ cmd: 'create-class-subject' }, { classId, dto: createClassSubjectDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    updateClassSubject(classId: string, classSubjectId: string, updateClassSubjectDto: UpdateClassSubjectDto) {
        return this.classServiceClient.send({ cmd: 'update-class-subject' }, { classId, classSubjectId, dto: updateClassSubjectDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    deleteClassSubject(classId: string, classSubjectId: string) {
        return this.classServiceClient.send({ cmd: 'delete-class-subject' }, { classId, classSubjectId })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    getClassSubject(classId: string, classSubjectId: string) {
        return this.classServiceClient.send({ cmd: 'get-class-subject' }, { classId, classSubjectId })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}