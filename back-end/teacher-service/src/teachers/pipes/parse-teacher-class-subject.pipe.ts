import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { TeacherClassSubjectsRepository } from "../repositories/teacher-class-subjects.repository";
import { TeacherClassSubject } from "../types/teacher-class-subject-custom.type";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class ParseTeacherClassSubjectPipe implements PipeTransform<string, Promise<TeacherClassSubject>> {

    constructor(private readonly teacherClassSubjectsRepository: TeacherClassSubjectsRepository) {}

    async transform(teacherClassSubjectId: string): Promise<TeacherClassSubject> {
        const teacherClassSubject = await this.teacherClassSubjectsRepository.findUniqueTeacherClassSubject({ id: teacherClassSubjectId });
        if (!teacherClassSubject) {
            throw new RpcException({ message: `Teacher class subject id ${teacherClassSubjectId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        return teacherClassSubject;
    }
}