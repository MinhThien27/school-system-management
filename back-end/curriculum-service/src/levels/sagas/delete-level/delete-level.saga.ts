import { HttpStatus, Logger } from "@nestjs/common";
import { SagaExecutionFailed } from "src/saga/exceptions";
import { RpcException } from "@nestjs/microservices";
import { Saga } from "src/saga/saga";
import { SagaBuilder } from "src/saga/saga-builder";
import { DeleteLevelSagaState } from "./delete-level-saga-state";

export class DeleteLevelSaga {

    private readonly logger = new Logger(DeleteLevelSaga.name);

    async excute(deleteLevelSagaState: DeleteLevelSagaState): Promise<void> {
        const saga = this.getDeleteLevelSagaDefination();
        try {
            await saga.execute(deleteLevelSagaState);
        } catch (err) {
            if (err instanceof SagaExecutionFailed) {
                this.logger.error(err);
                throw new RpcException({ 
                    message: err.message, 
                    stusCode: ((err.originalError) as any).statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR 
                });
            }
        }
    }

    private getDeleteLevelSagaDefination(): Saga<DeleteLevelSagaState> {
        const sagaBuilder = new SagaBuilder<DeleteLevelSagaState>();
        return sagaBuilder
            .step('delete-classes')
            .invoke((deleteLevelSagaState: DeleteLevelSagaState) => deleteLevelSagaState.makeDeleteClassesCommand())
            .build()
    }
}