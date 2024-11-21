import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { throwError, timeout } from "rxjs";
import { Filtering, Pagination, Sorting } from "src/decorators";

@Injectable()
export class AvailableTeacherSubjectsService {

    constructor(@Inject('TEACHER_SERVICE') private readonly teacherServiceClient: ClientProxy) {}

    getAvailableTeacherSubjects(teacherId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]) {
        return this.teacherServiceClient.send({ cmd: 'get-available-teacher-subjects' }, { teacherId, pagination, sorts, filters })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}