import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { CreateClassDto } from "../dtos/create-class.dto";
import { UpdateClassDto } from "../dtos/update-class.dto";
import { ClassesRepository } from "../repositories/classes.repository";
import { Class } from "../types/class-custom.type";

type CheckDuplicateClassDto = CreateClassDto | UpdateClassDto;
type CheckDuplicateClassPayload = { classId: string, dto: CheckDuplicateClassDto };

@Injectable()
export class CheckDuplicateClassPipe implements PipeTransform<CheckDuplicateClassPayload, Promise<CheckDuplicateClassPayload>> {

    constructor(
        private readonly classesRepository: ClassesRepository
    ) { }

    async transform(payload: CheckDuplicateClassPayload): Promise<CheckDuplicateClassPayload> {
        const { classId, dto } = payload;
        let _class: Class;
        if (classId) {
            _class = await this.classesRepository.findUniqueClass({ id: classId });
            if (!_class) {
                throw new RpcException({ message: `Class id ${classId} not found`, statusCode: HttpStatus.NOT_FOUND });
            }
        }
        await this.checkDuplicateFormTeacherInClass(dto, _class);
        await this.checkDuplicateNameInAcademicYear(dto, _class);
        await this.checkDuplicateRoomInAcademicYear(dto, _class);
        return payload;
    }

    private async checkDuplicateFormTeacherInClass(dto: CheckDuplicateClassDto, _class: Class): Promise<void> {
        let academicYearId = dto.academicYearId;
        let formTeacherId = dto.formTeacherId;
        if (_class) {
            academicYearId = (academicYearId && academicYearId !== _class.academicYearId) ? academicYearId : undefined;
            formTeacherId = (formTeacherId && formTeacherId !== _class.formTeacherId) ? formTeacherId : undefined;
            if (academicYearId && !formTeacherId) formTeacherId = _class.formTeacherId;
            if (!academicYearId && formTeacherId) academicYearId = _class.academicYearId;
        }
        if (!academicYearId && !formTeacherId) return;
        const duplicate = await this.classesRepository.findClass({
            academicYearId,
            formTeacherId
        });
        if (duplicate) {
            throw new RpcException({ message: `Form teacher id ${formTeacherId} already has class in academic year id ${academicYearId}`, statusCode: HttpStatus.CONFLICT });
        }
    }

    private async checkDuplicateNameInAcademicYear(dto: CheckDuplicateClassDto, _class: Class): Promise<void> {
        let name = dto.name;
        let academicYearId = dto.academicYearId;
        if (_class) {
            name = (name && name !== _class.name) ? name : undefined;
            academicYearId = (academicYearId && academicYearId !== _class.academicYearId) ? academicYearId : undefined;
            if (name && !academicYearId) academicYearId = _class.academicYearId;
            if (!name && academicYearId) name = _class.name;
        }
        if (!name && !academicYearId) return;
        const duplicate = await this.classesRepository.findClass({
            name,
            academicYearId
        });
        if (duplicate) {
            throw new RpcException({ message: `Class name ${name} already exist in academic year id ${academicYearId}`, statusCode: HttpStatus.CONFLICT });
        }
    }

    private async checkDuplicateRoomInAcademicYear(dto: CheckDuplicateClassDto, _class: Class): Promise<void> {
        let academicYearId = dto.academicYearId;
        let roomCode = dto.roomCode;
        if (_class) {
            academicYearId = (academicYearId && academicYearId !== _class.academicYearId) ? academicYearId : undefined;
            roomCode = (roomCode && roomCode !== _class.roomCode) ? roomCode : undefined;
            if (academicYearId && !roomCode) roomCode = _class.roomCode;
            if (!academicYearId && roomCode) academicYearId = _class.academicYearId;
        }
        if (!academicYearId && !roomCode) return;
        const duplicate = await this.classesRepository.findClass({
            academicYearId,
            roomCode
        });
        if (duplicate) {
            throw new RpcException({ message: `Room code ${roomCode} already has class in academic year id ${academicYearId}`, statusCode: HttpStatus.CONFLICT });
        }
    }
}