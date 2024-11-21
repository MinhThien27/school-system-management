import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { StudentDetailRepository } from "../repositories/student-detail.repository";
import { StudentDetail } from "../types/student-detail-custom.type";

@Injectable()
export class ParseStudentDetailPipe implements PipeTransform<string, Promise<StudentDetail>> {

    constructor(private readonly studentDetailRepository: StudentDetailRepository) {}

    async transform(studentDetailId: string): Promise<StudentDetail> {
        const studentDetail = await this.studentDetailRepository.findUniqueStudentDetail({ id: studentDetailId });
        if (!studentDetail) {
            throw new RpcException({ message: `Student detail id ${studentDetailId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        return studentDetail;
    }
}