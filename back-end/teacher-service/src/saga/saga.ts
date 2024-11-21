import { SagaCompensationFailed, SagaExecutionFailed } from "./exceptions";
import { SagaFLow } from "./saga-flow";

export enum SagaStates {
    New = 'New',
    InProcess = 'In Process',
    InCompensation = 'In Compensation',
    Complete = 'Complete',
    CompensationComplete = 'Compensation Complete',
    CompensationError = 'Compensation Error'
}

export class Saga<T> {
    private sagaFlow: SagaFLow<T>;

    private state: string;
    private invokeError: Error;
    private compensationError: Error;

    constructor(sagaFlow: SagaFLow<T>) {
        this.sagaFlow = sagaFlow;
        this.state = SagaStates.New;
    }

    getState(): string {
        return this.state;
    }

    async execute(params: T): Promise<T> {
        this.state = SagaStates.InProcess;
        try {
            await this.sagaFlow.invoke(params);
            this.state = SagaStates.Complete;

            return params;
        } catch (err) {
            this.state = SagaStates.InCompensation;
            this.invokeError = err;
            await this.runCompensationFlow(params);
            throw new SagaExecutionFailed(err);
        }
    }

    private async runCompensationFlow(params: T): Promise<void> {
        try {
            await this.sagaFlow.compensate(params);
            this.state = SagaStates.CompensationComplete;
        } catch (err) {
            this.state = SagaStates.CompensationError;
            this.compensationError = err;
            throw new SagaCompensationFailed(err);
        }
    }
}