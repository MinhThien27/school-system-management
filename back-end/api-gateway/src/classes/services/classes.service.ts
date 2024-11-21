import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateClassDto } from "../dtos/create-class.dto";
import { throwError, timeout } from "rxjs";
import { UpdateClassDto } from "../dtos/update-class.dto";
import { Filtering, Pagination, Sorting } from "src/decorators";

@Injectable()
export class ClassesService {
    
    constructor(@Inject('CLASS_SERVICE') private readonly classServiceClient: ClientProxy) {}

    getClasses(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]) {
        return this.classServiceClient.send({ cmd: 'get-classes' }, { pagination, sorts, filters })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    createClass(createClassDto: CreateClassDto) {
        return this.classServiceClient.send({ cmd: 'create-class' }, { dto: createClassDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    updateClass(classId: string, updateClassDto: UpdateClassDto) {
        return this.classServiceClient.send({ cmd: 'update-class' }, { classId, dto: updateClassDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    deleteClass(classId: string) {
        return this.classServiceClient.send({ cmd: 'delete-class' }, classId)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    getClass(classId: string) {
        return this.classServiceClient.send({ cmd: 'get-class' }, classId)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}