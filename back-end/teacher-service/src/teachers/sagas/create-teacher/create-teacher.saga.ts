import { SagaBuilder } from "src/saga/saga-builder";
import { Saga } from "src/saga/saga";
import { HttpStatus, Logger } from "@nestjs/common";
import { SagaExecutionFailed } from "src/saga/exceptions";
import { RpcException } from "@nestjs/microservices";
import { CreateTeacherSagaState } from "./create-teacher-saga-state";

export class CreateTeacherSaga {

    private readonly logger = new Logger(CreateTeacherSaga.name);

    async excute(createTeacherSagaState: CreateTeacherSagaState): Promise<void> {
        const saga = this.getCreateTeacherSagaDefination();
        try {
            await saga.execute(createTeacherSagaState);
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

    private getCreateTeacherSagaDefination(): Saga<CreateTeacherSagaState> {
        const sagaBuilder = new SagaBuilder<CreateTeacherSagaState>();
        return sagaBuilder
            .step()
            .withCompensation((createTeacherSagaState: CreateTeacherSagaState) => createTeacherSagaState.makeCancelCreateTeacherCommand())
            .step('save-image')
            .invoke((createTeacherSagaState: CreateTeacherSagaState) => createTeacherSagaState.makeSaveTeacherImageCommand())
            .withCompensation((createTeacherSagaState: CreateTeacherSagaState) => createTeacherSagaState.makeDeleteTeacherImageCommand())
            .step('update-teacher-image-url')
            .invoke((createTeacherSagaState: CreateTeacherSagaState) => createTeacherSagaState.makeUpdateTeacherImageUrlCommand())
            .step('create-user-account')
            .invoke((createTeacherSagaState: CreateTeacherSagaState) => createTeacherSagaState.makeCreateUserAccountCommand())
            .build()
    }
}