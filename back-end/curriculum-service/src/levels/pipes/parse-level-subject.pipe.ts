import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { LevelSubject } from "../types/level-subject-custom.type";
import { LevelSubjectsRepository } from "../repositories/level-subjects.repository";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class ParseLevelSubjectPipe implements PipeTransform<string, Promise<LevelSubject>> {

    constructor(private readonly levelSubjectsRepository: LevelSubjectsRepository) {}

    async transform(levelSubjectId: string): Promise<LevelSubject> {
        const levelSubject = await this.levelSubjectsRepository.findUniqueLevelSubject({ id: levelSubjectId });
        if (!levelSubject) {
            throw new RpcException({ message: `Level subject id ${levelSubjectId} not found`, statusCode: HttpStatus.NOT_FOUND });
        }
        return levelSubject;
    }
}