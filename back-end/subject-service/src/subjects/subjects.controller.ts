import { Controller, UseFilters } from "@nestjs/common";
import { SubjectsService } from "./services/subjects.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateSubjectDto } from "./dtos/create-subject.dto";
import { CheckDuplicateSubjectPipe } from "./pipes/check-duplicate-subject.pipe";
import { UpdateSubjectDto } from "./dtos/udpate-subject.dto";
import { ParseSubjectPipe } from "./pipes/parse-subject.pipe";
import { Subject } from "./types/subject-custom.type";
import { Filtering, Pagination, Sorting } from "src/interfaces";
import { AllExceptionsFilter } from "src/exception-filters";

@Controller()
@UseFilters(AllExceptionsFilter)
export class SubjectsController {

    constructor(
        private readonly subjectsService: SubjectsService
    ) {}

    @MessagePattern({ cmd: 'get-subjects' })
    getSubjects(
        @Payload('pagination') pagination: Pagination,
        @Payload('sorts') sorts?: Sorting[],
        @Payload('filters') filters?: Filtering[]
    ) {
        return this.subjectsService.getSubjects(pagination, sorts, filters);
    }

    @MessagePattern({ cmd: 'get-subjects-with-subject-ids' })
    getSubjectsWithSubjectIds(
        @Payload() subjectIds: string[]
    ) {
        return this.subjectsService.getSubjectsWithSubjectIds(subjectIds);
    }

    @MessagePattern({ cmd: 'create-subject' })
    createSubject(@Payload(CheckDuplicateSubjectPipe) createSubjectDto: CreateSubjectDto) {
        return this.subjectsService.createSubject(createSubjectDto);
    }

    @MessagePattern({ cmd: 'update-subject' })
    updateSubject(
        @Payload('subjectId', ParseSubjectPipe) subject: Subject,
        @Payload('updateSubjectDto') updateSubjectDto: UpdateSubjectDto
    ) {
        return this.subjectsService.updateSubject(subject, updateSubjectDto);
    }

    @MessagePattern({ cmd: 'delete-subject' })
    deleteSubject(@Payload(ParseSubjectPipe) subject: Subject) {
        return this.subjectsService.deleteSubject(subject.id);
    }

    @MessagePattern({ cmd: 'get-subject' })
    getSubject(@Payload(ParseSubjectPipe) subject: Subject) {
        return subject;
    }

    @MessagePattern({ cmd: 'get-subject-for-gateway' })
    getSubjectForGateway(@Payload(ParseSubjectPipe) subject: Subject) {
        return this.subjectsService.getSubjectForGateway(subject);
    }
}