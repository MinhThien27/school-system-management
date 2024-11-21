import { HttpStatus, Logger } from "@nestjs/common";
import { SagaExecutionFailed } from "src/saga/exceptions";
import { RpcException } from "@nestjs/microservices";
import { Saga } from "src/saga/saga";
import { SagaBuilder } from "src/saga/saga-builder";
import { DeleteAcademicYearSagaState } from "./delete-academic-year-saga-state";

export class DeleteAcademicYearSaga {

    private readonly logger = new Logger(DeleteAcademicYearSaga.name);

    async excute(deleteAcademicYearSagaState: DeleteAcademicYearSagaState): Promise<void> {
        const saga = this.getDeleteAcademicYearSagaDefination();
        try {
            await saga.execute(deleteAcademicYearSagaState);
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

    private getDeleteAcademicYearSagaDefination(): Saga<DeleteAcademicYearSagaState> {
        const sagaBuilder = new SagaBuilder<DeleteAcademicYearSagaState>();
        return sagaBuilder
            .step('delete-classes')
            .invoke((deleteAcademicYearSagaState: DeleteAcademicYearSagaState) => deleteAcademicYearSagaState.makeDeleteClassesCommand())
            .build()
    }
}