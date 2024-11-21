import { SagaBuilder } from "src/saga/saga-builder";
import { Saga } from "src/saga/saga";
import { HttpStatus, Logger } from "@nestjs/common";
import { SagaExecutionFailed } from "src/saga/exceptions";
import { RpcException } from "@nestjs/microservices";
import { CreateClassSubjectSagaState } from "./create-class-subject-saga-state";

export class CreateClassSubjectSaga {

    private readonly logger = new Logger(CreateClassSubjectSaga.name);

    async excute(createClassSubjectSagaState: CreateClassSubjectSagaState): Promise<void> {
        const saga = this.getCreateClassSubjectSagaDefination();
        try {
            await saga.execute(createClassSubjectSagaState);
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

    private getCreateClassSubjectSagaDefination(): Saga<CreateClassSubjectSagaState> {
        const sagaBuilder = new SagaBuilder<CreateClassSubjectSagaState>();
        return sagaBuilder
            .step()
            .withCompensation((createClassSubjectSagaState: CreateClassSubjectSagaState) => createClassSubjectSagaState.makeCancelCreateClassSubjectCommand())
            .step('create-grades')
            .invoke((createClassSubjectSagaState: CreateClassSubjectSagaState) => createClassSubjectSagaState.makeCreateGradesCommand())
            .build()
    }
}