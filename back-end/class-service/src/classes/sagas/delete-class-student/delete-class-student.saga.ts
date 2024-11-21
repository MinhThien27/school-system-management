import { HttpStatus, Logger } from "@nestjs/common";
import { SagaExecutionFailed } from "src/saga/exceptions";
import { RpcException } from "@nestjs/microservices";
import { Saga } from "src/saga/saga";
import { SagaBuilder } from "src/saga/saga-builder";
import { DeleteClassStudentSagaState } from "./delete-class-student-saga-state";

export class DeleteClassStudentSaga {

    private readonly logger = new Logger(DeleteClassStudentSaga.name);

    async excute(deleteClassStudentSagaState: DeleteClassStudentSagaState): Promise<void> {
        const saga = this.getDeleteClassStudentSagaDefination();
        try {
            await saga.execute(deleteClassStudentSagaState);
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

    private getDeleteClassStudentSagaDefination(): Saga<DeleteClassStudentSagaState> {
        const sagaBuilder = new SagaBuilder<DeleteClassStudentSagaState>();
        return sagaBuilder
            .step('delete-grades')
            .invoke((deleteClassStudentSagaState: DeleteClassStudentSagaState) => deleteClassStudentSagaState.makeDeleteGradesCommand())
            .build()
    }
}