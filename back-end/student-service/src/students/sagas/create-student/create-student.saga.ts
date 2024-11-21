import { SagaBuilder } from "src/saga/saga-builder";
import { CreateStudentSagaState } from "./create-student-saga-state";
import { Saga } from "src/saga/saga";
import { HttpStatus, Logger } from "@nestjs/common";
import { SagaExecutionFailed } from "src/saga/exceptions";
import { RpcException } from "@nestjs/microservices";

export class CreateStudentSaga {

    private readonly logger = new Logger(CreateStudentSaga.name);

    async excute(createStudentSagaState: CreateStudentSagaState): Promise<void> {
        const saga = this.getCreateStudentSagaDefination();
        try {
            await saga.execute(createStudentSagaState);
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

    private getCreateStudentSagaDefination(): Saga<CreateStudentSagaState> {
        const sagaBuilder = new SagaBuilder<CreateStudentSagaState>();
        return sagaBuilder
            .step()
            .withCompensation((createStudentSagaState: CreateStudentSagaState) => createStudentSagaState.makeCancelCreateStudentCommand())
            .step('save-image')
            .invoke((createStudentSagaState: CreateStudentSagaState) => createStudentSagaState.makeSaveStudentImageCommand())
            .withCompensation((createStudentSagaState: CreateStudentSagaState) => createStudentSagaState.makeDeleteStudentImageCommand())
            .step('update-student-image-url')
            .invoke((createStudentSagaState: CreateStudentSagaState) => createStudentSagaState.makeUpdateStudentImageUrlCommand())
            .step('create-user-account')
            .invoke((createStudentSagaState: CreateStudentSagaState) => createStudentSagaState.makeCreateUserAccountCommand())
            .build()
    }
}