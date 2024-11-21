import { SagaBuilder } from "src/saga/saga-builder";
import { Saga } from "src/saga/saga";
import { HttpStatus, Logger } from "@nestjs/common";
import { SagaExecutionFailed } from "src/saga/exceptions";
import { RpcException } from "@nestjs/microservices";
import { UpdateStudentSagaState } from "./update-student-saga-state";

export class UpdateStudentSaga {

    private readonly logger = new Logger(UpdateStudentSaga.name);

    async excute(updateStudentSagaState: UpdateStudentSagaState): Promise<void> {
        const saga = this.getUpdateStudentSagaDefination();
        try {
            await saga.execute(updateStudentSagaState);
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

    private getUpdateStudentSagaDefination(): Saga<UpdateStudentSagaState> {
        const sagaBuilder = new SagaBuilder<UpdateStudentSagaState>();
        return sagaBuilder
            .step()
            .withCompensation((udpateStudentSagaState: UpdateStudentSagaState) => udpateStudentSagaState.makeCancelUpdateStudentCommand())
            .step('update-student-image')
            .invoke((udpateStudentSagaState: UpdateStudentSagaState) => udpateStudentSagaState.makeSaveStudentImageCommand())
            .withCompensation((udpateStudentSagaState: UpdateStudentSagaState) => udpateStudentSagaState.makeDeleteStudentImageCommand())
            .step('update-student-image-url')
            .invoke((udpateStudentSagaState: UpdateStudentSagaState) => udpateStudentSagaState.makeUpdateStudentImageUrlCommand())
            .step('udpate-user-account')
            .invoke((udpateStudentSagaState: UpdateStudentSagaState) => udpateStudentSagaState.makeUpdateUserAccountCommand())
            .step('delete-old-student-image')
            .invoke((udpateStudentSagaState: UpdateStudentSagaState) => udpateStudentSagaState.makeDeleteOldStudentImageCommand())
            .build()
    }
}