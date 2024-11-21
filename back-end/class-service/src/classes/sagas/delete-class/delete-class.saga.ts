import { HttpStatus, Logger } from "@nestjs/common";
import { SagaExecutionFailed } from "src/saga/exceptions";
import { RpcException } from "@nestjs/microservices";
import { Saga } from "src/saga/saga";
import { SagaBuilder } from "src/saga/saga-builder";
import { DeleteClassSagaState } from "./delete-class-saga-state";

export class DeleteClassSaga {

    private readonly logger = new Logger(DeleteClassSaga.name);

    async excute(deleteClassSagaState: DeleteClassSagaState): Promise<void> {
        const saga = this.getDeleteClassSagaDefination();
        try {
            await saga.execute(deleteClassSagaState);
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

    private getDeleteClassSagaDefination(): Saga<DeleteClassSagaState> {
        const sagaBuilder = new SagaBuilder<DeleteClassSagaState>();
        return sagaBuilder
            .step('delete-teacher-class-subjects')
            .invoke((deleteClassSagaState: DeleteClassSagaState) => deleteClassSagaState.makeDeleteTeacherClassSubjectsCommand())
            .step('delete-grades')
            .invoke((deleteClassSagaState: DeleteClassSagaState) => deleteClassSagaState.makeDeleteGradesCommand())
            .build()
    }
}