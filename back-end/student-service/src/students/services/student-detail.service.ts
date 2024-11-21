import { HttpStatus, Injectable } from "@nestjs/common";
import { StudentDetailRepository } from "../repositories/student-detail.repository";
import { CreateStudentDetailDto } from "../dtos/create-student-detail.dto";
import { StudentDetail } from "../types/student-detail-custom.type";
import { UpdateStudentDetailDto } from "../dtos/update-student-detail.dto";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class StudentDetailService {

    constructor(private readonly studentDetailRepository: StudentDetailRepository) {}

    async getStudentDetail(studentId: string): Promise<StudentDetail> {
        const studentDetail = await this.studentDetailRepository.findUniqueStudentDetail({ studentId });
        if (!studentDetail) {
            throw new RpcException({ message: `Student detail of student id ${studentId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        return studentDetail;
    }

    createStudentDetail(studentId: string, createStudentDetailDto: CreateStudentDetailDto): Promise<StudentDetail> {
        return this.studentDetailRepository.createStudentDetail(studentId, createStudentDetailDto);
    }

    updateStudentDetail(studentDetailId: string, updateStudentDetailDto: UpdateStudentDetailDto): Promise<StudentDetail> {
        return this.studentDetailRepository.updateStudentDetail(studentDetailId, updateStudentDetailDto);
    }

    deleteStudentDetail(studentDetailId: string): Promise<StudentDetail> {
        return this.studentDetailRepository.deleteStudentDetail(studentDetailId);
    }
}