import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { Level } from "src/levels/types/level-custom.type";

export class DeleteLevelSagaState {

    constructor(
        private readonly levelServiceClient: ClientProxy,
        private readonly classServiceClient: ClientProxy,
        private readonly level: Level
    ) { }

    async makeDeleteClassesCommand() {
        console.log('Run makeDeleteClassesCommand')
        await firstValueFrom(this.classServiceClient.send(
            { cmd: 'delete-classes' },
            { levelId: this.level.id }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }
}