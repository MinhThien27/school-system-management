import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { LevelsRepository } from "../repositories/levels.repository";
import { Level } from "../types/level-custom.type";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class ParseLevelPipe implements PipeTransform<string, Promise<Level>> {

    constructor(private readonly levelsRepository: LevelsRepository) {}

    async transform(levelId: string): Promise<Level> {
        const level = await this.levelsRepository.findUniqueLevel({ id: levelId });
        if (!level) {
            throw new RpcException({ message: `Level id ${levelId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        return level;
    }
}