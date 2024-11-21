import { Injectable } from "@nestjs/common";
import { TeachersRepository } from "../repositories/teachers.repository";
import { UpdateTeacherImageUrlDto } from "../dtos/update-teacher-image-url.dto";
import { Teacher } from "@prisma/client";

@Injectable()
export class TeacherSagaService {

    constructor(private readonly teachersRepository: TeachersRepository) {}

    cancelCreateTeacher(teacherId: string): Promise<Teacher> {
        return this.teachersRepository.deleteTeacher(teacherId);
    }

    updateTeacherImageUrl(updateTeacherImageUrlDto: UpdateTeacherImageUrlDto): Promise<Teacher> {
        const { teacherId, imageUrl } = updateTeacherImageUrlDto;
        return this.teachersRepository.updateTeacher(teacherId, {}, imageUrl);
    }

    cancelUpdateTeacher(teacher: Teacher): Promise<Teacher> {
        const { id, imageUrl, ...updateTeacher } = teacher;
        return this.teachersRepository.updateTeacher(id, updateTeacher, imageUrl);
    }

    cancelDeleteTeacher(teacher: Teacher): Promise<Teacher> {
        const { id, imageUrl, ...createTeacher } = teacher;
        return this.teachersRepository.createTeacher(id, createTeacher, imageUrl);
    }
}