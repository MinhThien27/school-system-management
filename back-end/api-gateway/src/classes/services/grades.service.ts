import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { throwError, timeout } from "rxjs";
import { Filtering, Pagination, Sorting } from "src/decorators";
import { UpdateGradesDto } from "../dtos/update-grades.dto";

@Injectable()
export class GradesService {

    constructor(@Inject('CLASS_SERVICE') private readonly classServiceClient: ClientProxy) {}

    getGradesOfClassSubject(classId: string, classSubjectId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]) {
        return this.classServiceClient.send({ cmd: 'get-grades-of-class-subject' }, { classId, classSubjectId, pagination, sorts, filters })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    updateGradesOfClassSubject(classId: string, classSubjectId: string, updateGradesDto: UpdateGradesDto) {
        return this.classServiceClient.send({ cmd: 'update-grades-of-class-subject' }, { classId, classSubjectId, dto: updateGradesDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}