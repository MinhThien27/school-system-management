import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { throwError, timeout } from "rxjs";
import { Filtering, Pagination, Sorting } from "src/decorators";
import { CreateTeacherDto } from "../dtos/create-teacher.dto";
import { UpdateTeacherDto } from "../dtos/update-teacher.dto";

@Injectable()
export class TeachersService {

    constructor(@Inject('TEACHER_SERVICE') private readonly teachersServiceClient: ClientProxy) { }

    getTeachers(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]) {
        return this.teachersServiceClient.send({ cmd: 'get-teachers' }, { pagination, sorts, filters})
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            )
    }

    createTeacher(createTeacherDto: CreateTeacherDto, image: Express.Multer.File) {
        return this.teachersServiceClient.send({ cmd: 'create-teacher' }, { dto: createTeacherDto, image })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    updateTeacher(teacherId: string, updateTeacherDto: UpdateTeacherDto, image?: Express.Multer.File) {
        const payload = image ? { teacherId, dto: updateTeacherDto, image } : { teacherId, dto: updateTeacherDto };
        return this.teachersServiceClient.send({ cmd: 'update-teacher' }, payload)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    deleteTeacher(teacherId: string) {
        return this.teachersServiceClient.send({ cmd: 'delete-teacher' }, teacherId)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })  
            );
    }

    getTeacher(teacherId: string) {
        return this.teachersServiceClient.send({ cmd: 'get-teacher' }, teacherId)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}