import { HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { CreateLevelDto } from "../dtos/create-level.dto";
import { UpdateLevelDto } from "../dtos/update-level.dto";
import { LevelsRepository } from "../repositories/levels.repository";

type CheckDuplicateLeveltDto = CreateLevelDto | UpdateLevelDto;
type CheckDuplicateLevelPayload = { levelId: string, dto: CheckDuplicateLeveltDto };

@Injectable()
export class CheckDuplicateLevelPipe implements PipeTransform<CheckDuplicateLevelPayload, Promise<CheckDuplicateLevelPayload>> {

    constructor(
        private readonly levelsRepository: LevelsRepository
    ) {}

    async transform(payload: CheckDuplicateLevelPayload): Promise<CheckDuplicateLevelPayload> {
        const { levelId, dto } = payload;
        await this.checkDuplicateLevelNumberInLevel(levelId, dto);
        return payload;
    }

    private async checkDuplicateLevelNumberInLevel(levelId: string, dto: CheckDuplicateLeveltDto): Promise<void> {
        let levelNumber = dto.levelNumber;
        if (levelId) {
            const level = await this.levelsRepository.findUniqueLevel({ id: levelId });
            if (!level) {
                throw new RpcException({ message: `Level id ${levelId} not found`, statusCode: HttpStatus.NOT_FOUND });
            }
            levelNumber = (levelNumber && levelNumber !== level.levelNumber) ? levelNumber : undefined;
        }
        if (!levelNumber) return;
        const duplicate = await this.levelsRepository.findUniqueLevel({ levelNumber })
        if (duplicate) {
            throw new RpcException({ message: `Level number ${levelNumber} already exist`, statusCode: HttpStatus.CONFLICT });
        }
    }
}