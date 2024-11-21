import { HttpStatus, Logger } from "@nestjs/common";
import { DeleteStudentSagaState } from "./delete-student-saga-state";
import { SagaExecutionFailed } from "src/saga/exceptions";
import { RpcException } from "@nestjs/microservices";
import { Saga } from "src/saga/saga";
import { SagaBuilder } from "src/saga/saga-builder";

export class DeleteStudentSaga {

    private readonly logger = new Logger(DeleteStudentSaga.name);

    async excute(deleteStudentSagaState: DeleteStudentSagaState): Promise<void> {
        const saga = this.getDeleteStudentSagaDefination();
        try {
            await saga.execute(deleteStudentSagaState);
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

    private getDeleteStudentSagaDefination(): Saga<DeleteStudentSagaState> {
        const sagaBuilder = new SagaBuilder<DeleteStudentSagaState>();
        return sagaBuilder
            .step('delete-user-account')
            .invoke((deleteStudentSagaState: DeleteStudentSagaState) => deleteStudentSagaState.makeDeleteUserAccountCommand())
            .step('delete-class-students')
            .invoke((deleteStudentSagaState: DeleteStudentSagaState) => deleteStudentSagaState.makeDeleteClassStudentsCommand())
            .step('delete-student-image')
            .invoke((deleteStudentSagaState: DeleteStudentSagaState) => deleteStudentSagaState.makeDeleteStudentImageCommand())
            .build()
    }
}