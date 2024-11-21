import { HttpStatus, Logger } from "@nestjs/common";
import { SagaExecutionFailed } from "src/saga/exceptions";
import { RpcException } from "@nestjs/microservices";
import { Saga } from "src/saga/saga";
import { SagaBuilder } from "src/saga/saga-builder";
import { DeleteSubjectSagaState } from "./delete-subject-saga-state";

export class DeleteSubjectSaga {

    private readonly logger = new Logger(DeleteSubjectSaga.name);

    async excute(deleteSubjectSagaState: DeleteSubjectSagaState): Promise<void> {
        const saga = this.getDeleteSubjectSagaDefination();
        try {
            await saga.execute(deleteSubjectSagaState);
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

    private getDeleteSubjectSagaDefination(): Saga<DeleteSubjectSagaState> {
        const sagaBuilder = new SagaBuilder<DeleteSubjectSagaState>();
        return sagaBuilder
            .step('delete-department-subjects')
            .invoke((deleteSubjectSagaState: DeleteSubjectSagaState) => deleteSubjectSagaState.makeDeleteDepartmentSubjectsCommand())
            .step('delete-available-teacher-subjects')
            .invoke((deleteSubjectSagaState: DeleteSubjectSagaState) => deleteSubjectSagaState.makeDeleteAvailableTeacherSubjectsCommand())
            .step('delete-level-subjects')
            .invoke((deleteSubjectSagaState: DeleteSubjectSagaState) => deleteSubjectSagaState.makeDeleteLevelSubjectsCommand())
            .step('delete-class-subjects')
            .invoke((deleteSubjectSagaState: DeleteSubjectSagaState) => deleteSubjectSagaState.makeDeleteClassSubjectsCommand())
            .build()
    }
}