import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateParentDto } from "../dtos/create-parent.dto";
import { throwError, timeout } from "rxjs";
import { UpdateParentDto } from "../dtos/update-parent.dto";
import { Filtering, Pagination, Sorting } from "src/decorators";

@Injectable()
export class ParentsService {

    constructor(@Inject('STUDENT_SERVICE') private readonly studentServiceClient: ClientProxy) {}

    getParents(studentId: string, pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]) {
        return this.studentServiceClient.send({ cmd: 'get-parents' }, { studentId, pagination, sorts, filters })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    createParent(studentId: string, createParentDto: CreateParentDto) {
        return this.studentServiceClient.send({ cmd: 'create-parent' }, { studentId, dto: createParentDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    updateParent(studentId: string, parentId: string, updateParentDto: UpdateParentDto) {
        return this.studentServiceClient.send({ cmd: 'update-parent' }, { studentId, parentId, dto: updateParentDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    deleteParent(studentId: string, parentId: string) {
        return this.studentServiceClient.send({ cmd: 'delete-parent' }, { studentId, parentId })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    getParent(studentId: string, parentId: string) {
        return this.studentServiceClient.send({ cmd: 'get-parent' }, { studentId, parentId })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}