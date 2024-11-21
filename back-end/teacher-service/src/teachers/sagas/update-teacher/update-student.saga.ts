import { SagaBuilder } from "src/saga/saga-builder";
import { Saga } from "src/saga/saga";
import { HttpStatus, Logger } from "@nestjs/common";
import { SagaExecutionFailed } from "src/saga/exceptions";
import { RpcException } from "@nestjs/microservices";
import { UpdateTeacherSagaState } from "./update-teacher-saga-state";

export class UpdateTeacherSaga {

    private readonly logger = new Logger(UpdateTeacherSaga.name);

    async excute(updateTeacherSagaState: UpdateTeacherSagaState): Promise<void> {
        const saga = this.getUpdateTeacherSagaDefination();
        try {
            await saga.execute(updateTeacherSagaState);
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

    private getUpdateTeacherSagaDefination(): Saga<UpdateTeacherSagaState> {
        const sagaBuilder = new SagaBuilder<UpdateTeacherSagaState>();
        return sagaBuilder
            .step()
            .withCompensation((udpateTeacherSagaState: UpdateTeacherSagaState) => udpateTeacherSagaState.makeCancelUpdateTeacherCommand())
            .step('update-teacher-image')
            .invoke((udpateTeacherSagaState: UpdateTeacherSagaState) => udpateTeacherSagaState.makeSaveTeacherImageCommand())
            .withCompensation((udpateTeacherSagaState: UpdateTeacherSagaState) => udpateTeacherSagaState.makeDeleteTeacherImageCommand())
            .step('update-teacher-image-url')
            .invoke((udpateTeacherSagaState: UpdateTeacherSagaState) => udpateTeacherSagaState.makeUpdateTeacherImageUrlCommand())
            .step('udpate-user-account')
            .invoke((udpateTeacherSagaState: UpdateTeacherSagaState) => udpateTeacherSagaState.makeUpdateUserAccountCommand())
            .step('delete-old-teacher-image')
            .invoke((udpateTeacherSagaState: UpdateTeacherSagaState) => udpateTeacherSagaState.makeDeleteOldTeacherImageCommand())
            .build()
    }
}