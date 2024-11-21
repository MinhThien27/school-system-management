import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/services/database.service";
import { CreateStudentDetailDto } from "../dtos/create-student-detail.dto";
import { StudentDetail, studentDetailSelect } from "../types/student-detail-custom.type";
import { UpdateStudentDetailDto } from "../dtos/update-student-detail.dto";

@Injectable()
export class StudentDetailRepository {

    constructor(private readonly databaseService: DatabaseService) {}

    async findUniqueStudentDetail(filterQuery: { id: string } | { studentId: string }): Promise<StudentDetail> {
        const studentDetail = await this.databaseService.studentDetail.findUnique({
            where: filterQuery,
            select: studentDetailSelect
        });
        return studentDetail;
    }

    async createStudentDetail(studentId: string, createStudentDetailDto: CreateStudentDetailDto): Promise<StudentDetail> {
        const createdStudentDetail = await this.databaseService.studentDetail.create({
            data: { ...createStudentDetailDto, studentId },
            select: studentDetailSelect
        });
        return createdStudentDetail;
    }

    async updateStudentDetail(id: string, updateStudentDetailDto: UpdateStudentDetailDto): Promise<StudentDetail> {
        const updatedStudentDetail = await this.databaseService.studentDetail.update({
            where: { id },
            data: updateStudentDetailDto,
            select: studentDetailSelect
        });
        return updatedStudentDetail;
    }

    async deleteStudentDetail(id: string): Promise<StudentDetail> {
        const deletedStudentDetail = await this.databaseService.studentDetail.delete({
            where: { id },
            select: studentDetailSelect
        });
        return deletedStudentDetail;
    }
}