import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { ClassesRepository } from "../repositories/classes.repository";
import { RpcException } from "@nestjs/microservices";
import { Class } from "../types/class-custom.type";

@Injectable()
export class ParseClassPipe implements PipeTransform<string, Promise<Class>> {

    constructor(private readonly classesRepository: ClassesRepository) {}

    async transform(classId: string): Promise<Class> {
        const _class = await this.classesRepository.findUniqueClass({ id: classId });
        if (!_class) {
            throw new RpcException({ message: `Class id ${classId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        return _class;
    }
}