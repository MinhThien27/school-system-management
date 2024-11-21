import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateSubjectDto } from "../dtos/create-subject.dto";
import { throwError, timeout } from "rxjs";
import { UpdateSubjectDto } from "../dtos/update-subject.dto";
import { Filtering, Pagination, Sorting } from "src/decorators";

@Injectable()
export class SubjectsService {

    constructor(@Inject('SUBJECT_SERVICE') private readonly subjectServiceClient: ClientProxy) {}

    getSubjects(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]) {
        return this.subjectServiceClient.send({ cmd: 'get-subjects' }, { pagination, sorts, filters })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    createSubject(createSubjectDto: CreateSubjectDto) {
        return this.subjectServiceClient.send({ cmd: 'create-subject' }, createSubjectDto)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    updateSubject(subjectId: string, updateSubjectDto: UpdateSubjectDto) {
        return this.subjectServiceClient.send({ cmd: 'update-subject' }, { subjectId, updateSubjectDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    deleteSubject(subjectId: string) {
        return this.subjectServiceClient.send({ cmd: 'delete-subject' }, subjectId)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    getSubject(subjectId: string) {
        return this.subjectServiceClient.send({ cmd: 'get-subject-for-gateway' }, subjectId)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}