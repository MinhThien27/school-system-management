import { HttpStatus, Logger } from "@nestjs/common";
import { SagaExecutionFailed } from "src/saga/exceptions";
import { RpcException } from "@nestjs/microservices";
import { Saga } from "src/saga/saga";
import { SagaBuilder } from "src/saga/saga-builder";
import { DeleteClassSubjectSagaState } from "./delete-class-subject-saga-state";

export class DeleteClassSubjectSaga {

    private readonly logger = new Logger(DeleteClassSubjectSaga.name);

    async excute(deleteClassSubjectSagaState: DeleteClassSubjectSagaState): Promise<void> {
        const saga = this.getDeleteClassSubjectSagaDefination();
        try {
            await saga.execute(deleteClassSubjectSagaState);
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

    private getDeleteClassSubjectSagaDefination(): Saga<DeleteClassSubjectSagaState> {
        const sagaBuilder = new SagaBuilder<DeleteClassSubjectSagaState>();
        return sagaBuilder
            .step('delete-teacher-class-subjects')
            .invoke((deleteClassSubjectSagaState: DeleteClassSubjectSagaState) => deleteClassSubjectSagaState.makeDeleteTeacherClassSubjectsCommand())
            .step('delete-grades')
            .invoke((deleteClassSubjectSagaState: DeleteClassSubjectSagaState) => deleteClassSubjectSagaState.makeDeleteGradesCommand())
            .build()
    }
}