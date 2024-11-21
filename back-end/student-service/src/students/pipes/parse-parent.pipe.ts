import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { ParentsRepository } from "../repositories/parents.repository";
import { Parent } from "../types/parent-custom.type";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class ParseParentPipe implements PipeTransform<string, Promise<Parent>> {

    constructor(private readonly parentsRepository: ParentsRepository) {}

    async transform(id: string): Promise<Parent> {
        const parent = await this.parentsRepository.findUniqueParent({ id });
        if (!parent) {
            throw new RpcException({ message: `Parent id ${id} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        return parent;
    }
}