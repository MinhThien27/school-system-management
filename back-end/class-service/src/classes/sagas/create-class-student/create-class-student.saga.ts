import { SagaBuilder } from "src/saga/saga-builder";
import { Saga } from "src/saga/saga";
import { HttpStatus, Logger } from "@nestjs/common";
import { SagaExecutionFailed } from "src/saga/exceptions";
import { RpcException } from "@nestjs/microservices";
import { CreateClassStudentSagaState } from "./create-class-student-sage-state";

export class CreateClassStudentSaga {

    private readonly logger = new Logger(CreateClassStudentSaga.name);

    async excute(createClassStudentSagaState: CreateClassStudentSagaState): Promise<void> {
        const saga = this.getCreateClassStudentSagaDefination();
        try {
            await saga.execute(createClassStudentSagaState);
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

    private getCreateClassStudentSagaDefination(): Saga<CreateClassStudentSagaState> {
        const sagaBuilder = new SagaBuilder<CreateClassStudentSagaState>();
        return sagaBuilder
            .step()
            .withCompensation((createClassStudentSagaState: CreateClassStudentSagaState) => createClassStudentSagaState.makeCancelCreateClassStudentCommand())
            .step('create-grades')
            .invoke((createClassStudentSagaState: CreateClassStudentSagaState) => createClassStudentSagaState.makeCreateGradesCommand())
            .build()
    }
}