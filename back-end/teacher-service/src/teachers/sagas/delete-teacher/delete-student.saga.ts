import { HttpStatus, Logger } from "@nestjs/common";
import { DeleteTeacherSagaState } from "./delete-teacher-saga-state";
import { SagaExecutionFailed } from "src/saga/exceptions";
import { RpcException } from "@nestjs/microservices";
import { Saga } from "src/saga/saga";
import { SagaBuilder } from "src/saga/saga-builder";

export class DeleteTeacherSaga {

    private readonly logger = new Logger(DeleteTeacherSaga.name);

    async excute(deleteTeacherSagaState: DeleteTeacherSagaState): Promise<void> {
        const saga = this.getDeleteTeacherSagaDefination();
        try {
            await saga.execute(deleteTeacherSagaState);
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

    private getDeleteTeacherSagaDefination(): Saga<DeleteTeacherSagaState> {
        const sagaBuilder = new SagaBuilder<DeleteTeacherSagaState>();
        return sagaBuilder
            .step('delete-user-account')
            .invoke((deleteTeacherSagaState: DeleteTeacherSagaState) => deleteTeacherSagaState.makeDeleteUserAccountCommand())
            .step('delete-classes')
            .invoke((deleteTeacherSagaState: DeleteTeacherSagaState) => deleteTeacherSagaState.makeDeleteClassesCommand())
            .step('delete-teacher-image')
            .invoke((deleteTeacherSagaState: DeleteTeacherSagaState) => deleteTeacherSagaState.makeDeleteTeacherImageCommand())
            .build()
    }
}