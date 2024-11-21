import { Injectable } from "@nestjs/common";
import { TeacherClassSubjectsRepository } from "../repositories/teacher-class-subjects.repository";
import { TeacherClassSubject, TeacherClassSubjectWithDetail } from "../types/teacher-class-subject-custom.type";
import { CreateTeacherClassSubjectDto } from "../dtos/create-teacher-class-subject.dto";
import { UpdateTeacherClassSubjectDto } from "../dtos/update-teacher-class-subject.dto";
import { Filtering, PaginatedResource, Pagination, Sorting } from "src/interfaces";
import { Prisma } from "@prisma/client";
import { TeacherClassSubjectsFacade } from "../facades/teachers-class-subjects.facade";
import { SelectOption } from "src/interfaces/select-options.interfacte";

@Injectable()
export class TeacherClassSubjectsService {

    constructor(
        private readonly teacherClassSubjectsRepository: TeacherClassSubjectsRepository,
        private readonly teacherClassSubjectsFacade: TeacherClassSubjectsFacade
    ) {}
    
    async getTeacherClassSubjects(
        teacherId: string, 
        pagination: Pagination, 
        sorts?: Sorting[], 
        filters?: Filtering[]
    ): Promise<PaginatedResource<TeacherClassSubjectWithDetail>> {
        const teacherClassSubjects = await this.teacherClassSubjectsRepository.findTeacherClassSubjects(teacherId, pagination, sorts, filters);
        const teacherClassSubjectsWithDetail = await this.teacherClassSubjectsFacade.getTeacherClassSubjectsWithDetail(teacherClassSubjects);
        const teacherClassSubjectCount = await this.teacherClassSubjectsRepository.countTeacherClassSubjects({ teacherId });
        return {
            totalItems: teacherClassSubjectCount,
            items: teacherClassSubjectsWithDetail,
            page: pagination.page,
            size: pagination.size
        };
    }

    async getTeacherClassSubjectsWithFilterQuery(
        filterQuery: Prisma.TeacherClassSubjectWhereInput,
        selectOption: SelectOption
    ): Promise<TeacherClassSubjectWithDetail[]> {
        return this.teacherClassSubjectsFacade.getTeacherClassSubjectsWithDetail(
            await this.teacherClassSubjectsRepository.findTeacherClassSubjectsWithFilterQuery(filterQuery),
            selectOption
        );
    }

    async createTeacherClassSubject(
        teacherId: string, 
        createTeacherClassSubjectDto: CreateTeacherClassSubjectDto
    ): Promise<TeacherClassSubjectWithDetail> {
        return this.teacherClassSubjectsFacade.getTeacherClassSubjectWithDetail(
            await this.teacherClassSubjectsRepository.createTeacherClassSubject(teacherId, createTeacherClassSubjectDto)
        );
    }

    async updateTeacherClassSubject(
        teacherId: string,
        teacherClassSubjectTd: string, 
        updateTeacherClassSubjectDto: UpdateTeacherClassSubjectDto
    ): Promise<TeacherClassSubjectWithDetail> {
        return this.teacherClassSubjectsFacade.getTeacherClassSubjectWithDetail(
            await this.teacherClassSubjectsRepository.updateTeacherClassSubject(teacherId, teacherClassSubjectTd, updateTeacherClassSubjectDto)
        );
    }

    async getTeacherClassSubject(
        teacherClassSubject: TeacherClassSubject
    ): Promise<TeacherClassSubjectWithDetail> {
        return this.teacherClassSubjectsFacade.getTeacherClassSubjectWithDetail(teacherClassSubject);
    }

    deleteTeacherClassSubject(teacherClassSubjectTd: string): Promise<TeacherClassSubject> {
        return this.teacherClassSubjectsRepository.deleteTeacherClassSubject(teacherClassSubjectTd);
    }

    deleteTeacherClassSubjects(filterQuery: Prisma.TeacherClassSubjectWhereInput): Promise<Prisma.BatchPayload> {
        return this.teacherClassSubjectsRepository.deleteTeacherClassSubjects(filterQuery);
    }
}