import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateStudentDto } from "../dtos/create-student.dto";
import { throwError, timeout } from "rxjs";
import { UpdateStudentDto } from "../dtos/update-student.dto";
import { Filtering, Pagination, Sorting } from "src/decorators";

@Injectable()
export class StudentsService {

    constructor(@Inject('STUDENT_SERVICE') private readonly studentsServiceClient: ClientProxy) { }

    getStudents(pagination: Pagination, sorts?: Sorting[], filters?: Filtering[]) {
        return this.studentsServiceClient.send({ cmd: 'get-students' }, { pagination, sorts, filters})
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            )
    }

    createStudent(createStudentDto: CreateStudentDto, image: Express.Multer.File) {
        return this.studentsServiceClient.send({ cmd: 'create-student' }, { dto: createStudentDto, image })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    updateStudent(studentId: string, updateStudentDto: UpdateStudentDto, image?: Express.Multer.File) {
        const payload = image ? { studentId, dto: updateStudentDto, image } : { studentId, dto: updateStudentDto };
        return this.studentsServiceClient.send({ cmd: 'update-student' }, payload)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    deleteStudent(studentId: string) {
        return this.studentsServiceClient.send({ cmd: 'delete-student' }, studentId)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })  
            );
    }

    getStudent(studentId: string) {
        return this.studentsServiceClient.send({ cmd: 'get-student' }, studentId)
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}